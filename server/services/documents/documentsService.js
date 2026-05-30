'use strict';

const jwt = require('jsonwebtoken');
const db = require('./documentsDb');
const r2 = require('../storage/r2Client');
const connection = require('../../db/connection-wrapper');
const logger = require('../../utils/logger');

const SIGNED_REGISTRATION_TYPE_KEY = 'signed_registration';

// ── Verification session (mirrors the registration flow) ─────────────────────
// The public document link is the permanent families.doc_token. Before any
// upload/delete the family head proves possession of their phone (last 4
// digits) and receives a short-lived JWT bound to (vacationId, docToken).
// Each new session must verify again — the JWT expiry IS the session length.
const VERIFY_KIND        = 'documents_verify';
const VERIFY_JWT_EXPIRES = '30m';

// ── Completeness (X/Y) rules ─────────────────────────────────────────────────
// Required-slot derivation, evaluated against LIVE data at query time:
//   • signed_registration → FAMILY-LEVEL: one slot per family, not per guest.
//   • flight_ticket       → PER GUEST, but ONLY for independent fliers
//                           (flying_with_us = 0). NOTE this is the INVERSE of
//                           getGuestCompleteness, where flying_with_us = 1
//                           triggers flight-field requirements.
//   • everything else required (id_passport, custom types) → PER GUEST, all.
const FAMILY_LEVEL_TYPE_KEYS      = new Set(['signed_registration']);
const INDEPENDENT_FLIER_TYPE_KEYS = new Set(['flight_ticket']);

// Allowed upload types. The R2 key extension and the stored Content-Type are
// derived from the CONTENT-detected mime (sniffMime), never the client filename
// or client-supplied mimetype.
const EXT_BY_MIME = {
  'application/pdf': 'pdf',
  'image/jpeg': 'jpg',
  'image/png': 'png',
};
const MIME_BY_EXT = { pdf: 'application/pdf', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' };

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // server-side backstop to multer's limit

// Authoritative file-type check by content (magic bytes). Returns the detected
// mime, or null if the bytes don't match an allowed type — defeats a renamed
// .exe/.html/.svg masquerading as a PDF/JPEG/PNG via filename or Content-Type.
const sniffMime = (buf) => {
  if (!buf || buf.length < 4) return null;
  if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) return 'application/pdf'; // %PDF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';                          // FF D8 FF
  if (buf.length >= 8 &&
      buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47 &&
      buf[4] === 0x0d && buf[5] === 0x0a && buf[6] === 0x1a && buf[7] === 0x0a) return 'image/png';        // PNG sig
  return null;
};

// Display-only filename. The R2 key is app-constructed and never uses this, but
// strip path separators + control chars (incl. CR/LF) so the stored value can
// never traverse a path or be smuggled into a response header downstream.
const sanitizeFileName = (raw, ext) => {
  const decoded = Buffer.from(String(raw || ''), 'latin1').toString('utf8');
  let cleaned = '';
  for (const ch of decoded) {
    const code = ch.codePointAt(0);
    if (ch === '/' || ch === '\\') { cleaned += '_'; continue; } // path separators
    if (code < 0x20 || code === 0x7f) continue;                  // control chars (CR/LF/TAB/NUL)
    cleaned += ch;
  }
  cleaned = cleaned.trim();
  return (cleaned || `document.${ext}`).slice(0, 200);
};

// Safe Content-Type for a stored object, derived from the app-built key's
// extension (so a download response is never served as text/html).
const mimeFromKey = (key) => {
  const ext = String(key || '').split('.').pop().toLowerCase();
  return MIME_BY_EXT[ext] || 'application/octet-stream';
};

// Typed error so the public controller can map a thrown service error to the
// right HTTP status + machine code (mirrors registrationsService.RegistrationError).
class DocumentsError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

const isIndependentFlier = (guest) => Number(guest.flying_with_us) === 0;

// Last-4 source mirrors the registration verify: unified E.164 `phone`, falling
// back to the legacy phone_b (the real local number — phone_a is only the
// area-code Select). Never compare against phone_a.
const headPhoneDigits = (family) =>
  String(family.head_phone || family.head_phone_b || '').replace(/\D/g, '');

const fullName = (g) => `${g.hebrew_first_name || ''} ${g.hebrew_last_name || ''}`.trim();

// ── Public load (no-leak) ────────────────────────────────────────────────────
// Returns just enough to render the verify screen. Crucially exposes NO phone
// digits (the verify step asks for the last 4 — a hint would defeat the second
// factor). Throws TOKEN_NOT_FOUND when the doc_token resolves to nothing.
const getPublicInfo = async (vacationId, docToken) => {
  const family = await db.getFamilyByToken(vacationId, docToken);
  if (!family) throw new DocumentsError('TOKEN_NOT_FOUND', 'קישור לא תקין או שפג תוקפו');

  return {
    familyName: family.family_name,
    headFirstName: family.head_first_name || null,
    requiresPhoneVerify: true,
  };
};

// Post-verify page payload: members + the document-type catalog + what's
// already uploaded, so the client can render the upload grid.
const buildPageData = async (vacationId, family) => {
  const [members, docTypes, uploadedDocs] = await Promise.all([
    db.getFamilyMembers(vacationId, family.family_id),
    db.getDocumentTypes(vacationId),
    db.getDocsByFamily(vacationId, family.family_id),
  ]);
  return {
    family: { family_id: family.family_id, family_name: family.family_name },
    members,
    docTypes,
    uploadedDocs,
  };
};

// ── 4-digit phone verify → short-lived JWT ───────────────────────────────────
const verifyPhone = async (vacationId, docToken, lastFourDigits) => {
  if (typeof lastFourDigits !== 'string' || !/^\d{4}$/.test(lastFourDigits)) {
    throw new DocumentsError('BAD_FORMAT', 'יש להזין בדיוק 4 ספרות');
  }

  const family = await db.getFamilyByToken(vacationId, docToken);
  if (!family) throw new DocumentsError('TOKEN_NOT_FOUND', 'קישור לא תקין או שפג תוקפו');

  const digits = headPhoneDigits(family);
  if (digits.length < 4) {
    throw new DocumentsError('HEAD_GUEST_NO_PHONE', 'לא רשום טלפון תקין לראש המשפחה');
  }
  if (lastFourDigits !== digits.slice(-4)) {
    throw new DocumentsError('WRONG_PHONE', 'מספר הטלפון אינו תואם');
  }

  const verifyToken = jwt.sign(
    { kind: VERIFY_KIND, vid: vacationId, tok: docToken },
    process.env.TOKEN_SECRET_KEY,
    { expiresIn: VERIFY_JWT_EXPIRES }
  );

  const pageData = await buildPageData(vacationId, family);
  return { verifyToken, expiresIn: VERIFY_JWT_EXPIRES, ...pageData };
};

// Validate the session JWT carried by an upload/delete call and re-resolve the
// family from the doc_token it is bound to. Returns the family row.
const requireVerifiedFamily = async (vacationId, docToken, verifyToken) => {
  if (!verifyToken || typeof verifyToken !== 'string') {
    throw new DocumentsError('VERIFY_REQUIRED', 'נדרש אימות טלפון לפני העלאת מסמכים');
  }
  let payload;
  try {
    payload = jwt.verify(verifyToken, process.env.TOKEN_SECRET_KEY);
  } catch (e) {
    throw new DocumentsError('VERIFY_EXPIRED', 'תוקף האימות פג — בצע אימות מחדש');
  }
  if (payload?.kind !== VERIFY_KIND || payload?.vid !== vacationId || payload?.tok !== docToken) {
    throw new DocumentsError('VERIFY_MISMATCH', 'אימות לא תקין עבור קישור זה');
  }

  const family = await db.getFamilyByToken(vacationId, docToken);
  if (!family) throw new DocumentsError('TOKEN_NOT_FOUND', 'קישור לא תקין או שפג תוקפו');
  return family;
};

// ── Upload (R2-before-DB, latest-only overwrite) ─────────────────────────────
// Order mirrors the registration submit: write the object to R2 first, then
// the DB row, so a committed row never points at a missing file. The DB write
// is an upsert (uq_family_user_doctype), so re-uploading a slot replaces it;
// the superseded object is deleted best-effort AFTER the row is replaced.
const uploadDocument = async (vacationId, docToken, verifyToken, { userId, docTypeId, buffer, originalName }) => {
  const family = await requireVerifiedFamily(vacationId, docToken, verifyToken);

  if (!userId || !Number.isInteger(docTypeId)) {
    throw new DocumentsError('BAD_FORMAT', 'חסרים שדות חובה: user_id, doc_type_id');
  }
  if (!buffer || buffer.length === 0) {
    throw new DocumentsError('BAD_FILE', 'קובץ לא תקין');
  }
  // Server-side size backstop (multer also caps, but never trust client headers).
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new DocumentsError('BAD_FILE', 'הקובץ גדול מדי — מותר עד 10MB');
  }
  // Authoritative type check by CONTENT, not the client mimetype/filename.
  const detectedMime = sniffMime(buffer);
  const ext = detectedMime && EXT_BY_MIME[detectedMime];
  if (!ext) {
    throw new DocumentsError('BAD_FILE', 'סוג קובץ לא נתמך. ניתן להעלות PDF, JPG, PNG בלבד.');
  }

  // userId must belong to the verified family; docTypeId must be a known type.
  const [members, docTypes] = await Promise.all([
    db.getFamilyMembers(vacationId, family.family_id),
    db.getDocumentTypes(vacationId),
  ]);
  if (!members.some((m) => m.user_id === userId)) {
    throw new DocumentsError('INVALID_MEMBER', 'האורח אינו שייך למשפחה זו');
  }
  if (!docTypes.some((t) => t.id === docTypeId)) {
    throw new DocumentsError('INVALID_DOC_TYPE', 'סוג מסמך לא תקין');
  }

  // Display name only — sanitized; the R2 key below uses ONLY app-derived parts
  // (ids + timestamp + content-detected ext), never the client filename.
  const fileName = sanitizeFileName(originalName, ext);
  const ts = Date.now();
  const objectKey = `${vacationId}/documents/${family.family_id}/${userId}_${docTypeId}_${ts}.${ext}`;

  const prior = await db.getDocByFamilyUserType(vacationId, {
    family_id: family.family_id, user_id: userId, doc_type_id: docTypeId,
  });

  // Store with the detected content-type and force download (attachment) so the
  // object can never render inline as HTML/script if accessed via a URL.
  await r2.uploadToR2(objectKey, buffer, detectedMime, { contentDisposition: 'attachment' });

  try {
    await db.insertDocument(vacationId, {
      family_id: family.family_id,
      user_id: userId,
      doc_type_id: docTypeId,
      file_name: fileName,
      file_path: objectKey,
    });
  } catch (err) {
    // DB write failed after the object landed — remove the orphan, rethrow.
    try { await r2.deleteFromR2(objectKey); }
    catch (e) { logger.warn(`uploadDocument: R2 cleanup of ${objectKey} failed: ${e.message}`); }
    throw err;
  }

  // Replaced an older file → drop the superseded object (best-effort).
  if (prior?.file_path && prior.file_path !== objectKey) {
    try { await r2.deleteFromR2(prior.file_path); }
    catch (e) { logger.warn(`uploadDocument: R2 cleanup of superseded ${prior.file_path} failed: ${e.message}`); }
  }

  // Resolve the CURRENT row id for this slot so the client can act on it
  // (e.g. delete) without re-verifying. The upsert's insertId is unreliable on
  // an ON DUPLICATE KEY UPDATE overwrite, but the unique key keeps the row id
  // stable across insert/overwrite, so a fresh read is authoritative. On an
  // overwrite it equals prior.id; on a first insert it's the new row's id.
  const current = await db.getDocByFamilyUserType(vacationId, {
    family_id: family.family_id, user_id: userId, doc_type_id: docTypeId,
  });

  // familyName + docLabel are surfaced for the controller's coordinator
  // notification (mirrors the registration submit's returned display fields).
  const docLabel = docTypes.find((t) => t.id === docTypeId)?.label || null;
  return {
    docId: current?.id ?? null,
    familyId: family.family_id,
    userId,
    docTypeId,
    fileName,
    familyName: family.family_name || null,
    docLabel,
    // Whether this upload replaced an existing file for the slot — lets the
    // batched save notification say "updated" vs "uploaded".
    replaced: !!prior,
  };
};

// ── Public (family-head) delete ──────────────────────────────────────────────
// Removes one of the verified family's own documents (DB row scoped to
// family_id) plus its R2 object.
//
// The signed registration form IS a family_documents row whose user_id is the
// head guest's — so a family-scoped public delete COULD target it. We block
// that: only a coordinator may remove the signed form (which also resets the
// registration_requests state — see deleteDocument). The head re-uploads other
// document types via overwrite; they never need to delete the signed form.
const deletePublicDocument = async (vacationId, docToken, verifyToken, docId) => {
  const family = await requireVerifiedFamily(vacationId, docToken, verifyToken);

  const doc = await db.getDocByIdWithType(vacationId, docId);
  if (!doc || doc.family_id !== family.family_id) {
    throw new DocumentsError('NOT_FOUND', 'מסמך לא נמצא');
  }
  if (doc.type_key === SIGNED_REGISTRATION_TYPE_KEY) {
    throw new DocumentsError('SIGNED_FORM_LOCKED', 'לא ניתן למחוק טופס רישום חתום — פנה למשרד');
  }

  await db.deletePublicDocument(vacationId, docId, family.family_id);

  if (doc.file_path) {
    try { await r2.deleteFromR2(doc.file_path); }
    catch (e) { logger.warn(`deletePublicDocument: R2 cleanup of ${doc.file_path} failed: ${e.message}`); }
  }
  return { familyId: family.family_id, docId, userId: doc.user_id, docTypeId: doc.doc_type_id };
};

// ── Coordinator delete (authenticated) ───────────────────────────────────────
// All documents now live on R2 (file_path = object key), so cleanup deletes the
// R2 object — the old local-disk fs.unlink path is gone.
//
// signed_registration is special: deleting only the family_documents row would
// leave registration_requests stuck at status='signed' (hasSignedRegistration
// keeps blocking a new link) and orphan the signature PNG (family_documents
// only holds the PDF key). So for that type we FULLY WIPE the submission —
// delete the doc row AND delete the request row outright in one transaction,
// then best-effort delete BOTH R2 objects (PDF + signature). No audit trail is
// kept; the family returns to a clean "nothing submitted" state. Other types
// stay a simple row+object delete.
const deleteDocument = async (vacationId, docId) => {
  const doc = await db.getDocByIdWithType(vacationId, docId);
  if (!doc) return null;

  if (doc.type_key === SIGNED_REGISTRATION_TYPE_KEY) {
    // Read both keys BEFORE the row is deleted — they're unrecoverable after.
    const reg = await db.getSignedRegistrationKeys(vacationId, doc.family_id);

    await connection.withTransaction(async (tx) => {
      await db.wipeSignedRegistrationTx(tx, vacationId, { docId, familyId: doc.family_id });
    });

    // Best-effort, idempotent R2 cleanup of every key for this submission
    // (deduped; the doc's file_path is normally the same as reg.r2_pdf_key).
    const keys = new Set([doc.file_path, reg?.r2_pdf_key, reg?.r2_signature_key].filter(Boolean));
    for (const key of keys) {
      try { await r2.deleteFromR2(key); }
      catch (e) { logger.warn(`deleteDocument: R2 cleanup of ${key} failed: ${e.message}`); }
    }
  } else {
    await db.deleteDocument(vacationId, docId);
    if (doc.file_path) {
      try { await r2.deleteFromR2(doc.file_path); }
      catch (e) { logger.warn(`deleteDocument: R2 cleanup of ${doc.file_path} failed: ${e.message}`); }
    }
  }

  return { familyId: doc.family_id, userId: doc.user_id, docTypeId: doc.doc_type_id };
};

// ── Completeness (X/Y) + per-guest "what's missing" ──────────────────────────
// Derived in JS from three flat reads so the rules (per-guest vs family-level,
// flying_with_us-conditional flight_ticket) stay readable. Returns one entry
// per family with counts AND the missing breakdown, so the client renders both
// the X/Y badge and the "what's missing" popup from a single source.
const getAllFamiliesStatus = async (vacationId) => {
  const [families, guests, uploaded, types] = await Promise.all([
    db.getAllFamilies(vacationId),
    db.getGuestsForStatus(vacationId),
    db.getUploadedDocsForStatus(vacationId),
    db.getDocumentTypes(vacationId),
  ]);

  const requiredTypes = types.filter((t) => Number(t.is_required) === 1);
  const perGuestTypes = requiredTypes.filter((t) => !FAMILY_LEVEL_TYPE_KEYS.has(t.type_key));
  const familyTypes   = requiredTypes.filter((t) => FAMILY_LEVEL_TYPE_KEYS.has(t.type_key));

  // (family|user|docType) → uploaded; and (family|docType) for family-level.
  const perGuestUploaded = new Set(uploaded.map((u) => `${u.family_id}|${u.user_id}|${u.doc_type_id}`));
  const familyUploaded   = new Set(uploaded.map((u) => `${u.family_id}|${u.doc_type_id}`));

  const guestsByFamily = new Map();
  for (const g of guests) {
    if (!guestsByFamily.has(g.family_id)) guestsByFamily.set(g.family_id, []);
    guestsByFamily.get(g.family_id).push(g);
  }

  return families.map((fam) => {
    const famGuests = guestsByFamily.get(fam.family_id) || [];
    let total = 0;
    let uploadedCount = 0;
    const missingByGuest = [];

    for (const g of famGuests) {
      const guestMissing = [];
      for (const t of perGuestTypes) {
        // flight_ticket only required for independent fliers (flying_with_us=0).
        if (INDEPENDENT_FLIER_TYPE_KEYS.has(t.type_key) && !isIndependentFlier(g)) continue;
        total += 1;
        if (perGuestUploaded.has(`${fam.family_id}|${g.user_id}|${t.id}`)) uploadedCount += 1;
        else guestMissing.push(t.label);
      }
      if (guestMissing.length > 0) {
        missingByGuest.push({ user_id: g.user_id, name: fullName(g), missing: guestMissing });
      }
    }

    // Family-level slots (e.g. signed_registration): one per family.
    const missingFamily = [];
    for (const t of familyTypes) {
      total += 1;
      if (familyUploaded.has(`${fam.family_id}|${t.id}`)) uploadedCount += 1;
      else missingFamily.push(t.label);
    }

    return {
      family_id: fam.family_id,
      family_name: fam.family_name,
      uploaded: uploadedCount,
      total,
      missingByGuest,
      missingFamily,
    };
  });
};

const getFamilyDocuments = async (vacationId, familyId) => {
  return db.getDocsByFamily(vacationId, familyId);
};

// Build ONE detailed coordinator-notification payload for a whole save batch
// (not per file). Gated by the verify session and scoped to that family; labels
// and guest names are resolved server-side from the item ids so the message is
// authoritative. `items` = [{ userId, docTypeId, replaced }]. Returns the
// notification payload (the controller persists + emits it, mirroring the
// registration submit block). Throws on an invalid verify token.
const buildBatchNotification = async (vacationId, docToken, verifyToken, items) => {
  const family = await requireVerifiedFamily(vacationId, docToken, verifyToken);
  const [members, docTypes] = await Promise.all([
    db.getFamilyMembers(vacationId, family.family_id),
    db.getDocumentTypes(vacationId),
  ]);

  const nameByUser = new Map(members.map((m) => [m.user_id, fullName(m)]));
  const labelByType = new Map(docTypes.map((t) => [Number(t.id), t.label]));

  const describe = (it) => {
    const label = labelByType.get(Number(it.docTypeId)) || 'מסמך';
    const name = nameByUser.get(it.userId) || '';
    return name ? `${label} – ${name}` : label;
  };
  const added   = items.filter((i) => !i.replaced).map(describe);
  const updated = items.filter((i) => i.replaced).map(describe);

  const segments = [];
  if (added.length)   segments.push(`העלתה: ${added.join(', ')}`);
  if (updated.length) segments.push(`עדכנה: ${updated.join(', ')}`);
  const message = `משפחת ${family.family_name || ''} ${segments.join(' · ')}`.trim();

  const vacationName = await getVacationName(vacationId);
  return {
    vacation_id:   vacationId,
    vacation_name: vacationName || null,
    type:          'new_document',
    title:         'מסמכים חדשים',
    message,
    entity_id:     null, // batch — not tied to a single document row
    entity_type:   'document',
  };
};

// Vacation display name for the coordinator upload notification. Best-effort —
// returns null on failure so the (already best-effort) notification still fires.
const getVacationName = async (vacationId) => {
  try {
    return await db.getVacationName(vacationId);
  } catch (e) {
    logger.warn(`getVacationName(${vacationId}) failed: ${e.message}`);
    return null;
  }
};

const addDocumentType = async (vacationId, data) => {
  // Auto-derive type_key from label (slug) if not provided
  const type_key = data.type_key || data.label
    .toLowerCase()
    .replace(/[^a-z0-9֐-׿]+/g, '_')
    .replace(/^_|_$/g, '')
    || `custom_${Date.now()}`;

  const existing = await db.getDocumentTypes(vacationId);
  const sort_order = existing.length + 1;

  return db.addDocumentType(vacationId, { type_key, label: data.label, sort_order });
};

const deleteDocumentType = async (vacationId, typeId) => {
  return db.deleteDocumentType(vacationId, typeId);
};

// Returns the family's permanent document-link token, minting one on first use
// for old families whose doc_token is still NULL (the column defaults NULL and
// is only set by addFamily/imports — never backfilled). Generated once and
// stable thereafter, so this never returns null for an existing family.
const getFamilyLink = async (vacationId, familyId) => {
  let token = await db.getFamilyDocToken(vacationId, familyId);
  if (!token) {
    await db.ensureFamilyDocToken(vacationId, familyId);
    token = await db.getFamilyDocToken(vacationId, familyId);
  }
  return token;
};

/**
 * Resolve a download URL for a family_documents row. Every document now lives
 * on R2 (file_path = object key), so this presigns a GET URL for any type.
 * Default expiry 15 minutes (coordinator direct download); pass
 * { expiresIn: 7*24*60*60 } for the share-via-WhatsApp/email flow (7 days is
 * the AWS S3 / R2 max).
 */
const getDownloadInfo = async (vacationId, docId, { expiresIn = 900, disposition = 'attachment' } = {}) => {
  const doc = await db.getDocByIdWithType(vacationId, docId);
  if (!doc) return { code: 'NOT_FOUND' };
  // Always force a SAFE content-type derived from the app-built key — mimeFromKey
  // only ever returns pdf/jpeg/png (or octet-stream), never text/html, so neither
  // 'attachment' nor 'inline' can execute scripts. Coordinator downloads use
  // 'attachment'; the public head view passes 'inline' so PDFs/images render in
  // the browser tab instead of downloading.
  const url = await r2.getPresignedUrl(doc.file_path, expiresIn, {
    contentType: mimeFromKey(doc.file_path),
    contentDisposition: disposition,
  });
  return { ok: true, url, fileName: doc.file_name };
};

/**
 * Public (family-head) view: presign a doc the verified family uploaded, so the
 * head can open/confirm it. Gated by the verify JWT (requireVerifiedFamily) and
 * scoped to that family — a head can never view another family's document. Once
 * ownership is confirmed it reuses getDownloadInfo with INLINE disposition so the
 * head actually SEES the file (PDF/image renders in a new tab) rather than
 * downloading it — safe because the content-type is always pdf/jpeg/png.
 */
const getPublicDownloadInfo = async (vacationId, docToken, verifyToken, docId) => {
  const family = await requireVerifiedFamily(vacationId, docToken, verifyToken);
  const doc = await db.getDocByIdWithType(vacationId, docId);
  if (!doc || doc.family_id !== family.family_id) return { code: 'NOT_FOUND' };
  return getDownloadInfo(vacationId, docId, { disposition: 'inline' });
};

module.exports = {
  DocumentsError,
  getPublicInfo,
  verifyPhone,
  uploadDocument,
  deletePublicDocument,
  deleteDocument,
  getAllFamiliesStatus,
  getFamilyDocuments,
  addDocumentType,
  deleteDocumentType,
  getFamilyLink,
  getDownloadInfo,
  getPublicDownloadInfo,
  getVacationName,
  buildBatchNotification,
};
