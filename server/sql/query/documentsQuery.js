'use strict';

const getDocumentTypes = (vacationId) =>
  `SELECT * FROM \`trip_tracker_${vacationId}\`.family_document_types ORDER BY sort_order`;

const addDocumentType = (vacationId) =>
  `INSERT INTO \`trip_tracker_${vacationId}\`.family_document_types (type_key, label, is_required, sort_order) VALUES (?, ?, 1, ?)`;

const deleteDocumentType = (vacationId) =>
  `DELETE FROM \`trip_tracker_${vacationId}\`.family_document_types WHERE id = ?`;

// Latest-only upsert: the uq_family_user_doctype UNIQUE key (family_id,
// user_id, doc_type_id) makes a re-upload for the same guest+type REPLACE the
// existing row in one statement (same ON DUPLICATE KEY UPDATE convention as
// payment_provider_configs). The caller reads the prior file_path first
// (getDocByFamilyUserType) so the superseded R2 object can be cleaned up.
const insertDocument = (vacationId) =>
  `INSERT INTO \`trip_tracker_${vacationId}\`.family_documents (family_id, user_id, doc_type_id, file_name, file_path)
   VALUES (?, ?, ?, ?, ?)
   ON DUPLICATE KEY UPDATE file_name = VALUES(file_name), file_path = VALUES(file_path), uploaded_at = NOW()`;

// Prior row for a (family_id, user_id, doc_type_id) slot — used before an
// overwrite so the old R2 object key can be deleted after the upsert commits.
const getDocByFamilyUserType = (vacationId) =>
  `SELECT id, file_path FROM \`trip_tracker_${vacationId}\`.family_documents
   WHERE family_id = ? AND user_id = ? AND doc_type_id = ?
   LIMIT 1`;

const deleteDocument = (vacationId) =>
  `DELETE FROM \`trip_tracker_${vacationId}\`.family_documents WHERE id = ?`;

// Public (family-head) delete — scoped to the verified family so a verified
// head can only remove their OWN family's document, never an arbitrary id.
const deletePublicDocument = (vacationId) =>
  `DELETE FROM \`trip_tracker_${vacationId}\`.family_documents WHERE id = ? AND family_id = ?`;

const getDocsByFamily = (vacationId) =>
  `SELECT fd.*, fdt.type_key, fdt.label
   FROM \`trip_tracker_${vacationId}\`.family_documents fd
   JOIN \`trip_tracker_${vacationId}\`.family_document_types fdt ON fd.doc_type_id = fdt.id
   WHERE fd.family_id = ?`;

const getDocById = (vacationId) =>
  `SELECT * FROM \`trip_tracker_${vacationId}\`.family_documents WHERE id = ?`;

// Same as getDocById but JOINed with family_document_types so the caller has
// the type_key/label alongside the row.
const getDocByIdWithType = (vacationId) =>
  `SELECT fd.*, fdt.type_key, fdt.label
   FROM \`trip_tracker_${vacationId}\`.family_documents fd
   JOIN \`trip_tracker_${vacationId}\`.family_document_types fdt ON fd.doc_type_id = fdt.id
   WHERE fd.id = ?
   LIMIT 1`;

// ── Inputs for the per-family completeness computation ───────────────────────
// The X/Y math is derived in the service (documentsService.getAllFamiliesStatus)
// from these three flat reads rather than a single aggregate query, because the
// required-slot rules depend on per-guest flying_with_us AND on whether a doc
// type is per-guest (id_passport / custom) or family-level (signed_registration)
// — logic that is far clearer in JS than in GROUP BY arithmetic.

const getAllFamilies = (vacationId) =>
  `SELECT family_id, family_name FROM \`trip_tracker_${vacationId}\`.families`;

// flying_with_us is read here (live) — it is freely mutable via the guest editor.
const getGuestsForStatus = (vacationId) =>
  `SELECT family_id, user_id, hebrew_first_name, hebrew_last_name, flying_with_us
   FROM \`trip_tracker_${vacationId}\`.guest`;

const getUploadedDocsForStatus = (vacationId) =>
  `SELECT family_id, user_id, doc_type_id FROM \`trip_tracker_${vacationId}\`.family_documents`;

// Resolve the family AND its head-of-household (is_main_user = 1) from the
// permanent families.doc_token. The head's phone is returned so the verify
// step can compare the last 4 digits; phone_a/phone_b are the legacy pair and
// `phone` is the unified E.164 value (preferred). LEFT JOIN so a family with
// no marked head still resolves (verify then fails with HEAD_GUEST_NO_PHONE).
const getFamilyByToken = (vacationId) =>
  `SELECT
     f.family_id,
     f.family_name,
     g.user_id           AS head_user_id,
     g.hebrew_first_name AS head_first_name,
     g.phone             AS head_phone,
     g.phone_a           AS head_phone_a,
     g.phone_b           AS head_phone_b
   FROM \`trip_tracker_${vacationId}\`.families f
   LEFT JOIN \`trip_tracker_${vacationId}\`.guest g
          ON g.family_id = f.family_id AND g.is_main_user = 1
   WHERE f.doc_token = ?
   LIMIT 1`;

const getFamilyMembers = (vacationId) =>
  `SELECT user_id, hebrew_first_name, hebrew_last_name, flying_with_us FROM \`trip_tracker_${vacationId}\`.guest WHERE family_id = ?`;

// ── signed_registration wipe (coordinator delete of the signed form) ─────────
// Deleting the family_documents PDF row alone leaves registration_requests
// stuck at status='signed' (so hasSignedRegistration keeps blocking new links)
// and orphans the signature PNG (family_documents only knows the PDF key).
// These read both R2 keys (before deletion) and remove the request row outright.

const getSignedRegistrationKeys = (vacationId) =>
  `SELECT r2_pdf_key, r2_signature_key
   FROM \`trip_tracker_${vacationId}\`.registration_requests
   WHERE family_id = ? AND status = 'signed'
   LIMIT 1`;

// Full wipe: delete the request row entirely (no audit trail kept) so the family
// returns to a clean "nothing was ever submitted" state and a fresh link can be
// issued. Read getSignedRegistrationKeys FIRST — once the row is gone the R2
// keys are unrecoverable.
const deleteSignedRegistration = (vacationId) =>
  `DELETE FROM \`trip_tracker_${vacationId}\`.registration_requests
   WHERE family_id = ? AND status = 'signed'`;

const getFamilyDocToken = (vacationId) =>
  `SELECT doc_token FROM \`trip_tracker_${vacationId}\`.families WHERE family_id = ?`;

// Mint a doc_token for an old family that predates the UUID()-on-insert default
// (the column is DEFAULT NULL and was never backfilled). Uses the SAME DB-side
// UUID() as familyQuery.addFamily. The WHERE guard makes it idempotent and
// race-safe — it only fills a missing token, never overwrites an existing one.
const ensureFamilyDocToken = (vacationId) =>
  `UPDATE \`trip_tracker_${vacationId}\`.families
   SET doc_token = UUID()
   WHERE family_id = ? AND (doc_token IS NULL OR doc_token = '')`;

// Vacation display name lives in the SHARED trip_tracker DB (not a tenant DB),
// so this query is fully-qualified and takes the vacation_id as a parameter.
// Used to populate vacation_name on the coordinator upload notification.
const getVacationName = () =>
  `SELECT name FROM trip_tracker.vacations WHERE vacation_id = ? LIMIT 1`;

module.exports = {
  getDocumentTypes,
  addDocumentType,
  deleteDocumentType,
  insertDocument,
  getDocByFamilyUserType,
  deleteDocument,
  deletePublicDocument,
  getDocsByFamily,
  getDocById,
  getDocByIdWithType,
  getAllFamilies,
  getGuestsForStatus,
  getUploadedDocsForStatus,
  getFamilyByToken,
  getFamilyMembers,
  getSignedRegistrationKeys,
  deleteSignedRegistration,
  getFamilyDocToken,
  ensureFamilyDocToken,
  getVacationName,
};
