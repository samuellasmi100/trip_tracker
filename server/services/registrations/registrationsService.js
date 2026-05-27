'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const db = require('./registrationsDb');
const r2 = require('../storage/r2Client');
const connection = require('../../db/connection-wrapper');
const { parseDateLoose } = require('../../utils/dateNormalize');
const { generateRegistrationPdf } = require('./pdfGenerator');
const logger = require('../../utils/logger');

const SIGNED_REGISTRATION_TYPE_KEY = 'signed_registration';
const MIN_PHONE_DIGITS = 7;       // local Israeli number length after stripping non-digits

// Single source of truth for "is this a usable phone for the registration
// link?" — we always check phone_b (the actual number), not phone_a (which
// is only the area-code Select). Returns the cleaned digit string when
// usable, or '' otherwise.
const usablePhoneDigits = (phoneB) => {
  const digits = String(phoneB || '').replace(/\D/g, '');
  return digits.length >= MIN_PHONE_DIGITS ? digits : '';
};

// Resolve phone_a + phone_b into a wa.me-ready digit string (no "+"). The
// dual-column storage isn't used consistently across the app:
//   • Excel imports populate phone_a as the FULL number, phone_b = NULL.
//   • The GuestEditor form treats phone_a as the area-code Select and
//     phone_b as the local part — but users sometimes type the full number
//     into phone_b too, leaving doubled area codes on save.
//   • Other UI sites display phone_a alone as "the phone".
// We can't unify the storage in this PR, but we can detect every shape
// and produce a single correct international digit string.
const buildWhatsAppDigits = (phoneA, phoneB) => {
  const a = String(phoneA || '').trim();
  const b = String(phoneB || '').trim();
  const aDigits = a.replace(/\D/g, '');
  const bDigits = b.replace(/\D/g, '');

  // International country code declared in phone_a (e.g. "+44", legacy "+1081").
  if (a.startsWith('+')) {
    // phone_b may already include the country code (form-fighting users).
    if (bDigits.length > 0 && bDigits.startsWith(aDigits)) return bDigits;
    return aDigits + bDigits;
  }

  // Israeli local form. Decide whether phone_b is the COMPLETE number on its
  // own (typed as "0544372393"), or the LOCAL part needing the area-code
  // prefix from phone_a (typed as "4372393").
  let combined;
  if (bDigits.length >= 9 && bDigits.startsWith('0')) {
    combined = bDigits;
  } else if (bDigits.length > 0) {
    combined = aDigits + bDigits;
  } else {
    combined = aDigits;
  }

  // Normalize: Israeli leading "0" → "972" so wa.me accepts it.
  if (combined.startsWith('0')) return '972' + combined.slice(1);
  return combined;
};

const TOKEN_BYTES        = 32;            // → 64 hex chars
const EXPIRY_MS_1D       = 24 * 60 * 60 * 1000;
const VERIFY_JWT_EXPIRES = '15m';         // window between verify and submit
const AGREEMENT_TERMS_VERSION = 'static-v1';
const SCHEMA_VERSION     = 1;
const USER_AGENT_MAX_LEN = 1000;          // cap whatever the client sent

// Typed-error helper so the controller can map a thrown service error to the
// right HTTP status + body without losing the machine-readable code.
class RegistrationError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const generateToken = () => crypto.randomBytes(TOKEN_BYTES).toString('hex');

const buildPublicPath = (vacationId, token) => `/public/register/${vacationId}/${token}`;

// Vacation name lives in the SHARED trip_tracker DB. Mirrors the helper in
// publicSignaturesController.getVacationInfo — kept here so the public
// registrations controller stays slim. Non-fatal on failure.
const getVacationName = async (vacationId) => {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });
    const [rows] = await conn.query(
      'SELECT name FROM trip_tracker.vacations WHERE vacation_id = ? LIMIT 1',
      [vacationId]
    );
    return rows[0]?.name || null;
  } catch (err) {
    logger.warn(`registrationsService.getVacationName(${vacationId}) failed: ${err.message}`);
    return null;
  } finally {
    if (conn) await conn.end();
  }
};

// Mask all but the last 4 digits of a phone, e.g. "0501234567" → "******4567".
const maskPhoneAllButLast4 = (phone) => {
  const clean = String(phone || '').replace(/\D/g, '');
  if (clean.length < 4) return clean;
  return '*'.repeat(clean.length - 4) + clean.slice(-4);
};

// Per DECISION 2: count guests under 2 by parsing guest.birth_date with the
// project's existing parseDateLoose. Unparseable / missing values are NOT
// silently skipped — they're returned in parse_warnings AND logged so the
// employee can see when the count may be understated before the signed PDF
// renders. The reference date is the signing moment, not "today".
const computeInfantsUnder2 = (guestRows, signedAt) => {
  const refMs = signedAt.getTime();
  let count = 0;
  const parse_warnings = [];

  for (const row of guestRows) {
    const raw = row.birth_date;
    if (raw == null || String(raw).trim() === '') {
      parse_warnings.push({ guest_id: row.id, raw_birth_date: raw == null ? null : String(raw) });
      continue;
    }
    const iso = parseDateLoose(String(raw).trim());
    if (!iso) {
      parse_warnings.push({ guest_id: row.id, raw_birth_date: String(raw) });
      continue;
    }
    const bdMs = new Date(`${iso}T00:00:00Z`).getTime();
    const ageMs = refMs - bdMs;
    const ageYears = ageMs / (365.2425 * 24 * 60 * 60 * 1000);
    if (ageYears >= 0 && ageYears < 2) count += 1;
  }
  return { count, parse_warnings };
};

const isExpired = (row) => new Date(row.expires_at).getTime() <= Date.now();

/**
 * Create a registration link for the family's head-of-household.
 *
 * Behavior:
 *   - If the family doesn't exist in this vacation        → NO_FAMILY
 *   - If no guest has is_main_user=1 for this family      → NO_MAIN_GUEST
 *   - If that head guest has no phone_a                   → HEAD_GUEST_NO_PHONE
 *   - If an active pending non-expired request exists     → REUSE it (idempotent)
 *   - Otherwise: generate a fresh token + insert a new row with 1-day expiry.
 *
 * Returns { token, expiresAt, path, reused, headFirstName }.
 * Path is relative — the client prefixes window.location.origin
 * (matches the existing doc_token / sign / booking link pattern).
 */
const createLink = async (vacationId, familyId, { createdBy = null } = {}) => {
  const family = await db.getFamilyByFamilyId(vacationId, familyId);
  if (!family) {
    throw new RegistrationError('NO_FAMILY', 'המשפחה לא נמצאה');
  }

  const head = await db.getMainGuest(vacationId, familyId);
  if (!head) {
    throw new RegistrationError(
      'NO_MAIN_GUEST',
      'המשפחה לא כוללת ראש משפחה — סמן נופש כ"משתמש ראשי" לפני יצירת קישור הרשמה'
    );
  }
  // The actual phone number lives in phone_b; phone_a is just the area-code
  // Select. Require phone_b to have enough digits to plausibly be a real
  // number so the link is never issued for a guest who can't pass verify.
  if (!usablePhoneDigits(head.phone_b)) {
    throw new RegistrationError(
      'HEAD_GUEST_NO_PHONE',
      'לראש המשפחה לא רשום מספר טלפון תקין — לא ניתן ליצור קישור הרשמה ללא טלפון לאימות'
    );
  }

  // Terminal-state guard: a signed registration is the end of the line for
  // this family. Re-issuing a link would be a coordinator mistake (the family
  // would receive a SECOND link asking for the same signature). Reject loudly.
  if (await db.hasSignedRegistration(vacationId, familyId)) {
    throw new RegistrationError(
      'ALREADY_SIGNED',
      'המשפחה כבר חתמה על הטופס — לא ניתן לשלוח קישור חדש'
    );
  }

  // Extra fields surfaced for the "send link" dialog on the client (WhatsApp /
  // Email / Copy). headPhone is the already-normalized digit string for
  // wa.me (no "+", country code first) — buildWhatsAppDigits handles every
  // observed phone_a/phone_b shape (form-compliant, form-fighting, legacy
  // import, international). Email may be null; the client disables the
  // Email button in that case.
  const headPhone = buildWhatsAppDigits(head.phone_a, head.phone_b);
  const headEmail = head.email || null;
  const vacationName = await getVacationName(vacationId);

  const existing = await db.getActivePendingRequest(vacationId, familyId);
  if (existing) {
    return {
      token: existing.token,
      expiresAt: existing.expires_at,
      path: buildPublicPath(vacationId, existing.token),
      reused: true,
      headFirstName: head.hebrew_first_name || null,
      headPhone,
      headEmail,
      vacationName,
    };
  }

  const token = generateToken();
  const expiresAt = new Date(Date.now() + EXPIRY_MS_1D);

  await db.insertRegistrationRequest(vacationId, {
    familyId,
    guestId: head.id,
    token,
    expiresAt,
    createdBy,
  });

  return {
    token,
    expiresAt,
    path: buildPublicPath(vacationId, token),
    reused: false,
    headFirstName: head.hebrew_first_name || null,
    headPhone,
    headEmail,
    vacationName,
  };
};

/**
 * Public GET — returns enough info to render the public registration page
 * without leaking the phone (verify step uses last-4 separately).
 *
 * Status mapping (client-recoverable):
 *   - no row                                 → TOKEN_NOT_FOUND   (404)
 *   - row exists, status='cancelled'         → CANCELLED          (410)
 *   - row exists, status='pending', expired  → EXPIRED            (410)
 *   - row exists, status='signed'            → 200 { alreadySigned:true, signedAt }
 *   - row exists, status='pending', live     → 200 { familyName, headFirstName, ... }
 */
const getPublicInfo = async (vacationId, token) => {
  const row = await db.getRegistrationByToken(vacationId, token);
  if (!row) throw new RegistrationError('TOKEN_NOT_FOUND', 'קישור לא תקין');

  if (row.status === 'cancelled') {
    throw new RegistrationError('CANCELLED', 'הקישור בוטל — פנה למארגן לקבלת קישור חדש');
  }
  if (row.status === 'pending' && isExpired(row)) {
    throw new RegistrationError('EXPIRED', 'תוקף הקישור פג — פנה למארגן לקבלת קישור חדש');
  }
  if (row.status === 'signed') {
    return {
      alreadySigned: true,
      signedAt: row.signed_at,
      familyName: row.family_name,
      headFirstName: row.head_first_name || null,
    };
  }

  // status === 'pending' and not expired
  const vacationName = await getVacationName(vacationId);
  return {
    alreadySigned: false,
    familyName: row.family_name,
    headFirstName: row.head_first_name || null,
    phoneHint: maskPhoneAllButLast4(row.head_phone_a),
    vacationName,
    expiresAt: row.expires_at,
    requiresPhoneVerify: true,
  };
};

/**
 * Public POST verify — checks last 4 digits of head's phone, issues a short-
 * lived JWT bound to (vacationId, token) on success. Increments verify_attempts
 * regardless of outcome for audit. Rate-limit middleware sits in front of this
 * in the controller; the route-level check here is the slow-path business rule.
 */
const verifyPhone = async (vacationId, token, lastFourDigits) => {
  if (typeof lastFourDigits !== 'string' || !/^\d{4}$/.test(lastFourDigits)) {
    throw new RegistrationError('BAD_FORMAT', 'יש להזין בדיוק 4 ספרות');
  }

  const row = await db.getRegistrationByToken(vacationId, token);
  if (!row) throw new RegistrationError('TOKEN_NOT_FOUND', 'קישור לא תקין');
  if (row.status === 'cancelled') throw new RegistrationError('CANCELLED', 'הקישור בוטל');
  if (row.status === 'signed')    throw new RegistrationError('ALREADY_SIGNED', 'המשפחה כבר חתמה');
  if (row.status === 'pending' && isExpired(row)) {
    throw new RegistrationError('EXPIRED', 'תוקף הקישור פג');
  }

  // Always bump the audit counter, success or fail.
  try { await db.incrementVerifyAttempts(vacationId, token); }
  catch (e) { logger.warn(`verifyPhone: incrementVerifyAttempts failed: ${e.message}`); }

  // Compare against the actual phone (phone_b), not the area code (phone_a).
  // createLink already enforces phone_b is present at link-issue time, so in
  // normal operation this guard is unreachable; it stays as defense against
  // an edit-after-issue race where someone wipes the phone on the guest row.
  const headDigits = String(row.head_phone_b || '').replace(/\D/g, '');
  if (headDigits.length < 4) {
    throw new RegistrationError('HEAD_GUEST_NO_PHONE', 'ראש המשפחה ללא טלפון תקין במערכת');
  }
  if (lastFourDigits !== headDigits.slice(-4)) {
    throw new RegistrationError('WRONG_PHONE', 'מספר הטלפון אינו תואם');
  }

  const verifyToken = jwt.sign(
    { kind: 'register_verify', vid: vacationId, tok: token },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: VERIFY_JWT_EXPIRES }
  );

  // Post-verify form data — the registration page renders this as the
  // read-only "orderer details" + payment block. Phone is exposed in full
  // here (vs the masked phoneHint on the GET endpoint) because the client
  // has just proven they hold those digits. Email is similarly post-verify.
  const fullPhone = `${row.head_phone_a || ''}${row.head_phone_b || ''}`.trim();
  const formData = {
    requestCreatedAt: row.request_created_at,
    familyName:       row.family_name,
    headFirstName:    row.head_first_name || null,
    headLastName:     row.head_last_name  || null,
    headPhone:        fullPhone || null,
    headEmail:        row.head_email || null,
    stayStartDate:    row.stay_start_date || null,
    stayEndDate:      row.stay_end_date   || null,
    totalAmount:      row.total_amount    || null,
    paymentMethod:    row.payment_method  || null,
    numPayments:      row.num_payments    || null,
  };
  return { verifyToken, expiresIn: VERIFY_JWT_EXPIRES, formData };
};

// Pull the freshest family + birth_date rows + vacation name and roll them into
// the locked snapshot. Done at signing time per DECISION 5 so the signed PDF
// stays accurate even if the family record is edited later.
const buildSnapshot = async ({ vacationId, registrationRow, clientInputs, signedAt }) => {
  const familyRow = await db.getFamilyForSnapshot(vacationId, registrationRow.family_id);
  const guestRows = await db.getGuestBirthDatesByFamily(vacationId, registrationRow.family_id);
  const vacationName = await getVacationName(vacationId);
  const infants = computeInfantsUnder2(guestRows, signedAt);

  if (infants.parse_warnings.length > 0) {
    logger.warn(
      `registrationsService.buildSnapshot: ${infants.parse_warnings.length} ` +
      `unparseable birth_date(s) for family_id=${registrationRow.family_id} ` +
      `(vacation=${vacationId}) — guest_ids=${infants.parse_warnings.map(w => w.guest_id).join(',')}`
    );
  }

  // Last-4 for the snapshot/PDF comes from the actual phone number (phone_b),
  // matching the verify-comparison source — never from phone_a (area code).
  const headLast4 = String(registrationRow.head_phone_b || '').replace(/\D/g, '').slice(-4);

  return {
    schema_version: SCHEMA_VERSION,
    signed_at_iso: signedAt.toISOString(),
    client_inputs: {
      address:        String(clientInputs.address        ?? ''),
      city:           String(clientInputs.city           ?? ''),
      postal_code:    String(clientInputs.postal_code    ?? ''),
      general_notes:  String(clientInputs.general_notes  ?? ''),
    },
    display_snapshot: {
      family_name:      familyRow?.family_name      ?? registrationRow.family_name ?? null,
      head_first_name:  registrationRow.head_first_name ?? null,
      head_phone_last4: headLast4 || null,
      stay_start_date:  familyRow?.start_date  ?? null,
      stay_end_date:    familyRow?.end_date    ?? null,
      rooms_requested:  familyRow?.number_of_rooms ?? null,
      total_guests:     familyRow?.number_of_guests ?? null,
      infants_under_2:  infants,
      total_amount:     familyRow?.total_amount   ?? null,
      payment_method:   familyRow?.payment_method ?? null,
      num_payments:     familyRow?.num_payments   ?? null,
      vacation_name:    vacationName,
      agreement_terms_version: AGREEMENT_TERMS_VERSION,
    },
  };
};

/**
 * Public POST submit (STEP 5: full PDF flow).
 *
 * Order is deliberate:
 *   1. JWT verify + signature payload validation (cheap, no side-effects).
 *   2. Re-load registration row + status/expiry guards.
 *   3. Resolve the `signed_registration` doc_type_id once up-front. If the
 *      seed row is missing for this tenant, fail fast with DOC_TYPE_MISSING
 *      pointing at the backfill script.
 *   4. Build the locked snapshot (DECISION 5: frozen at signing time).
 *   5. Generate the PDF in memory from the snapshot + signature image.
 *   6. Upload signature PNG to R2.
 *   7. Upload signed PDF to R2.
 *   8. withTransaction({
 *        UPDATE registration_requests (optimistic-lock on status='pending')
 *        INSERT family_documents (doc_type_id = signed_registration)
 *      }) — both commit or both roll back.
 *   9. On any failure after R2 uploads: best-effort delete of BOTH R2
 *      objects so we don't pay for ghosts. The original error is rethrown.
 *
 * Why this order is safe:
 *   - R2 writes precede DB writes, so a successful DB transaction always
 *     references files that exist.
 *   - The MySQL transaction wraps the only two writes that must be
 *     consistent, so the employee will never see "signed" on the
 *     registration without a matching Documents-page row, or vice versa.
 *   - The WHERE status='pending' clause prevents double-submit races: the
 *     second submit's UPDATE returns affectedRows=0, the tx callback
 *     throws NOT_PENDING, and the INSERT never fires.
 */
const submitRegistration = async (
  vacationId,
  token,
  { verifyToken, signatureData, clientInputs, signerIp, userAgent }
) => {
  // 1. verifyToken JWT
  if (!verifyToken || typeof verifyToken !== 'string') {
    throw new RegistrationError('VERIFY_REQUIRED', 'נדרש לעבור אימות טלפון לפני שליחה');
  }
  let payload;
  try {
    payload = jwt.verify(verifyToken, process.env.TOKEN_SECRET_KEY);
  } catch (e) {
    throw new RegistrationError('VERIFY_EXPIRED', 'תוקף האימות פג — בצע אימות מחדש');
  }
  if (payload?.kind !== 'register_verify' || payload?.vid !== vacationId || payload?.tok !== token) {
    throw new RegistrationError('VERIFY_MISMATCH', 'אימות לא תקין עבור קישור זה');
  }

  // 2. signature payload sanity
  if (typeof signatureData !== 'string' || !signatureData.startsWith('data:image/png;base64,')) {
    throw new RegistrationError('BAD_SIGNATURE', 'חתימה לא תקינה');
  }
  const base64 = signatureData.slice('data:image/png;base64,'.length);
  let sigBuffer;
  try {
    sigBuffer = Buffer.from(base64, 'base64');
    if (sigBuffer.length < 100) throw new Error('too small');
  } catch {
    throw new RegistrationError('BAD_SIGNATURE', 'חתימה לא תקינה');
  }

  // 3. reload + status guards
  const row = await db.getRegistrationByToken(vacationId, token);
  if (!row)                           throw new RegistrationError('TOKEN_NOT_FOUND', 'קישור לא תקין');
  if (row.status === 'cancelled')     throw new RegistrationError('CANCELLED', 'הקישור בוטל');
  if (row.status === 'signed')        throw new RegistrationError('ALREADY_SIGNED', 'המשפחה כבר חתמה');
  if (row.status === 'pending' && isExpired(row)) {
    throw new RegistrationError('EXPIRED', 'תוקף הקישור פג');
  }

  // 4. doc_type_id for 'signed_registration' (resolved early so we fail
  //    BEFORE doing any expensive PDF/R2 work if the seed is missing).
  const docTypeId = await db.getDocTypeIdByKey(vacationId, SIGNED_REGISTRATION_TYPE_KEY);
  if (!docTypeId) {
    throw new RegistrationError(
      'DOC_TYPE_MISSING',
      `סוג המסמך "${SIGNED_REGISTRATION_TYPE_KEY}" חסר בטבלת family_document_types. ` +
      `הרץ: node scripts/backfillRegistrationDocType.js --apply`
    );
  }

  // 5. snapshot (built before any R2/PDF work so a snapshot bug never
  //    orphans an R2 file).
  const signedAt = new Date();
  const snapshot = await buildSnapshot({
    vacationId,
    registrationRow: row,
    clientInputs: clientInputs || {},
    signedAt,
  });

  // 6. PDF generation
  let pdfBuffer;
  try {
    pdfBuffer = await generateRegistrationPdf(snapshot, signatureData, row.id, signerIp || null);
  } catch (err) {
    logger.error(`submitRegistration: PDF generation failed: ${err.message}`);
    throw new RegistrationError('PDF_GENERATION_FAILED', 'יצירת ה-PDF נכשלה');
  }

  // 7-8. R2 uploads (sig first, then PDF). Any failure in either, or in the
  //      DB transaction below, will trigger best-effort cleanup of whichever
  //      objects already landed.
  const ts = signedAt.getTime();
  const r2SigKey = `${vacationId}/registrations/${row.family_id}/sig_${row.id}_${ts}.png`;
  const r2PdfKey = `${vacationId}/registrations/${row.family_id}/pdf_${row.id}_${ts}.pdf`;
  const uploaded = { sig: false, pdf: false };

  const cleanupR2 = async () => {
    if (uploaded.sig) {
      try { await r2.deleteFromR2(r2SigKey); }
      catch (e) { logger.warn(`submitRegistration: R2 cleanup of ${r2SigKey} failed: ${e.message}`); }
    }
    if (uploaded.pdf) {
      try { await r2.deleteFromR2(r2PdfKey); }
      catch (e) { logger.warn(`submitRegistration: R2 cleanup of ${r2PdfKey} failed: ${e.message}`); }
    }
  };

  try {
    await r2.uploadToR2(r2SigKey, sigBuffer, 'image/png');
    uploaded.sig = true;
    await r2.uploadToR2(r2PdfKey, pdfBuffer, 'application/pdf');
    uploaded.pdf = true;

    // 9. atomic DB writes
    const familyDocFileName =
      `טופס הרשמה - ${row.family_name || row.family_id}.pdf`.slice(0, 200);
    // family_documents.user_id is NOT NULL. Prefer guest.user_id; fall back
    // to the head guest's int id stringified so we never violate the column.
    const userIdForDocs = (row.head_user_id && String(row.head_user_id).trim())
      ? String(row.head_user_id)
      : String(row.guest_id);

    await connection.withTransaction(async (tx) => {
      await db.submitRegistrationWriteTx(tx, vacationId, {
        token,
        signerIp: signerIp || null,
        userAgent: userAgent ? String(userAgent).slice(0, USER_AGENT_MAX_LEN) : null,
        r2SignatureKey: r2SigKey,
        r2PdfKey,
        formDataJson: JSON.stringify(snapshot),
        familyId: row.family_id,
        userIdForDocs,
        docTypeId,
        fileName: familyDocFileName,
        filePath: r2PdfKey,
      });
    });
  } catch (err) {
    await cleanupR2();
    if (err && err.code === 'NOT_PENDING') {
      throw new RegistrationError('NOT_PENDING', 'הקישור כבר אינו במצב ממתין לחתימה');
    }
    throw err;
  }

  // Display fields surfaced for the controller's notification + socket emit.
  // Pulled from the snapshot so they reflect the *signed* values, not whatever
  // might be in the families row at the moment the controller reads them.
  const ds = snapshot.display_snapshot || {};
  return {
    success: true,
    signedAt: signedAt.toISOString(),
    registrationId: row.id,
    pdfReady: true,
    familyName:   ds.family_name      || row.family_name || null,
    headFirstName: ds.head_first_name || row.head_first_name || null,
    vacationName: ds.vacation_name    || null,
  };
};

module.exports = {
  createLink,
  getPublicInfo,
  verifyPhone,
  submitRegistration,
  RegistrationError,
};
