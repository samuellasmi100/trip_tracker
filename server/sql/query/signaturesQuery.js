'use strict';

const getFamilyByToken = (vacationId) =>
  `SELECT family_id, family_name, doc_token FROM \`trip_tracker_${vacationId}\`.families WHERE doc_token = ? LIMIT 1`;

const getSignatureByFamily = (vacationId) =>
  `SELECT * FROM \`trip_tracker_${vacationId}\`.family_signatures WHERE family_id = ? ORDER BY signed_at DESC LIMIT 1`;

const insertSignature = (vacationId) =>
  `INSERT INTO \`trip_tracker_${vacationId}\`.family_signatures (family_id, signer_name, signature_image_path, ip_address) VALUES (?, ?, ?, ?)`;

const getAllStatus = (vacationId) =>
  `SELECT f.family_id, f.family_name, f.signature_sent_at, f.doc_token,
          fs.signer_name, fs.signed_at, fs.id AS sig_id
   FROM \`trip_tracker_${vacationId}\`.families f
   LEFT JOIN \`trip_tracker_${vacationId}\`.family_signatures fs ON f.family_id = fs.family_id
   ORDER BY f.family_name`;

const setSentAt = (vacationId) =>
  `UPDATE \`trip_tracker_${vacationId}\`.families SET signature_sent_at = NOW() WHERE family_id = ?`;

const deleteSignature = (vacationId) =>
  `DELETE FROM \`trip_tracker_${vacationId}\`.family_signatures WHERE family_id = ?`;

module.exports = {
  getFamilyByToken,
  getSignatureByFamily,
  insertSignature,
  getAllStatus,
  setSentAt,
  deleteSignature,
};
