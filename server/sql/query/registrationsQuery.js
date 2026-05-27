'use strict';

// Confirms the family exists in this vacation. Returned shape kept minimal —
// the controller only needs to know whether the family_id resolves.
const getFamilyByFamilyId = (vacationId) => `
  SELECT family_id, family_name
  FROM \`trip_tracker_${vacationId}\`.families
  WHERE family_id = ?
  LIMIT 1
`;

// Head-of-family lookup. is_main_user is the existing per-guest flag
// (schema.js: guest.is_main_user tinyint DEFAULT 0).
//
// phone_a is the area-code Select (050/052/+44/…); phone_b is the actual
// local number. Both must be returned so the service can validate that a
// real phone is on file and compare last-4 against the real digits.
const getMainGuest = (vacationId) => `
  SELECT id, hebrew_first_name, phone_a, phone_b, email
  FROM \`trip_tracker_${vacationId}\`.guest
  WHERE family_id = ? AND is_main_user = 1
  LIMIT 1
`;

// Has the family ever signed? One row with status='signed' is enough to make
// re-issuing a link wrong — the registration is terminal at that point. Use
// LIMIT 1 to short-circuit; we only need existence.
const hasSignedRegistration = (vacationId) => `
  SELECT 1
  FROM \`trip_tracker_${vacationId}\`.registration_requests
  WHERE family_id = ? AND status = 'signed'
  LIMIT 1
`;

// Active = status pending AND not yet expired. ORDER + LIMIT 1 so we always
// return the freshest one if (somehow) multiple existed.
const getActivePendingRequest = (vacationId) => `
  SELECT id, token, expires_at
  FROM \`trip_tracker_${vacationId}\`.registration_requests
  WHERE family_id = ?
    AND status = 'pending'
    AND expires_at > NOW()
  ORDER BY created_at DESC
  LIMIT 1
`;

// expires_at is bound as a JS Date — mysql2 formats it for DATETIME.
// status defaults to 'pending' via the column DEFAULT; we still set it
// explicitly to make the row's intent obvious at the call site.
const insertRegistrationRequest = (vacationId) => `
  INSERT INTO \`trip_tracker_${vacationId}\`.registration_requests
    (family_id, guest_id, token, expires_at, status, created_by)
  VALUES (?, ?, ?, ?, 'pending', ?)
`;

// Used by GET /public/register and the verify+submit lookups. JOINs the
// family + head guest in one round-trip so the controller doesn't have to
// fan out three reads. LEFT JOIN on guest because guest_id may be NULL
// (shouldn't happen in practice — STEP 3 always populates it — but defensive).
const getRegistrationByToken = (vacationId) => `
  SELECT
    rr.id,
    rr.family_id,
    rr.guest_id,
    rr.token,
    rr.expires_at,
    rr.status,
    rr.signed_at,
    rr.verify_attempts,
    rr.created_at        AS request_created_at,
    f.family_name,
    f.start_date         AS stay_start_date,
    f.end_date           AS stay_end_date,
    f.total_amount,
    f.payment_method,
    f.num_payments,
    g.hebrew_first_name AS head_first_name,
    g.hebrew_last_name  AS head_last_name,
    g.phone_a           AS head_phone_a,
    g.phone_b           AS head_phone_b,
    g.email             AS head_email,
    g.user_id           AS head_user_id
  FROM \`trip_tracker_${vacationId}\`.registration_requests rr
  INNER JOIN \`trip_tracker_${vacationId}\`.families f ON rr.family_id = f.family_id
  LEFT JOIN \`trip_tracker_${vacationId}\`.guest g ON g.id = rr.guest_id
  WHERE rr.token = ?
  LIMIT 1
`;

// Locked-at-signing snapshot inputs. Family numbers + dates + payment fields,
// all from the live families row at submit time.
const getFamilyForSnapshot = (vacationId) => `
  SELECT
    family_id, family_name,
    number_of_guests, number_of_rooms,
    total_amount, payment_method, num_payments,
    start_date, end_date
  FROM \`trip_tracker_${vacationId}\`.families
  WHERE family_id = ?
  LIMIT 1
`;

// All birth_dates in the family — feed into parseDateLoose-based infants-under-2
// calc. Returns ids alongside for the parse_warnings audit list.
const getGuestBirthDatesByFamily = (vacationId) => `
  SELECT id, birth_date
  FROM \`trip_tracker_${vacationId}\`.guest
  WHERE family_id = ?
`;

// Atomic +1. Run on every verify attempt — both success and failure — so the
// audit count reflects real activity even if the rate limiter blocks later.
const incrementVerifyAttempts = (vacationId) => `
  UPDATE \`trip_tracker_${vacationId}\`.registration_requests
  SET verify_attempts = verify_attempts + 1
  WHERE token = ?
`;

// Optimistic-lock UPDATE: the WHERE status='pending' clause is the only
// dup-submission gate (no separate SELECT). affectedRows = 1 means we
// were the first writer to flip it; 0 means someone else already did.
//
// Stores both R2 keys in one shot at signing time (STEP 5). The companion
// INSERT into family_documents runs in the same transaction — see
// registrationsDb.submitRegistrationWriteTx.
const markSignedAfterSubmit = (vacationId) => `
  UPDATE \`trip_tracker_${vacationId}\`.registration_requests
  SET
    status            = 'signed',
    signed_at         = NOW(),
    signer_ip         = ?,
    signer_user_agent = ?,
    r2_signature_key  = ?,
    r2_pdf_key        = ?,
    form_data         = ?
  WHERE token = ? AND status = 'pending'
`;

// Resolve the auto-increment id of the seeded 'signed_registration' doc type
// once at the start of the submit endpoint; if missing, the controller fails
// fast and points the operator at the backfill script.
const getDocTypeIdByKey = (vacationId) => `
  SELECT id FROM \`trip_tracker_${vacationId}\`.family_document_types
  WHERE type_key = ?
  LIMIT 1
`;

// family_documents row that exposes the signed PDF on the Documents page.
// file_path holds the R2 key (not a filesystem path) — the download endpoint
// will presign it. user_id is NOT NULL on the column, so the caller is
// responsible for passing a non-null value (head guest's user_id, falling
// back to the head guest's int id stringified).
const insertFamilyDocument = (vacationId) => `
  INSERT INTO \`trip_tracker_${vacationId}\`.family_documents
    (family_id, user_id, doc_type_id, file_name, file_path)
  VALUES (?, ?, ?, ?, ?)
`;

module.exports = {
  getFamilyByFamilyId,
  getMainGuest,
  hasSignedRegistration,
  getActivePendingRequest,
  insertRegistrationRequest,
  getRegistrationByToken,
  getFamilyForSnapshot,
  getGuestBirthDatesByFamily,
  incrementVerifyAttempts,
  markSignedAfterSubmit,
  getDocTypeIdByKey,
  insertFamilyDocument,
};
