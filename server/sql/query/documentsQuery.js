'use strict';

const getDocumentTypes = (vacationId) =>
  `SELECT * FROM \`trip_tracker_${vacationId}\`.family_document_types ORDER BY sort_order`;

const addDocumentType = (vacationId) =>
  `INSERT INTO \`trip_tracker_${vacationId}\`.family_document_types (type_key, label, is_required, sort_order) VALUES (?, ?, 1, ?)`;

const deleteDocumentType = (vacationId) =>
  `DELETE FROM \`trip_tracker_${vacationId}\`.family_document_types WHERE id = ?`;

const insertDocument = (vacationId) =>
  `INSERT INTO \`trip_tracker_${vacationId}\`.family_documents (family_id, user_id, doc_type_id, file_name, file_path) VALUES (?, ?, ?, ?, ?)`;

const deleteDocument = (vacationId) =>
  `DELETE FROM \`trip_tracker_${vacationId}\`.family_documents WHERE id = ?`;

const getDocsByFamily = (vacationId) =>
  `SELECT fd.*, fdt.type_key, fdt.label
   FROM \`trip_tracker_${vacationId}\`.family_documents fd
   JOIN \`trip_tracker_${vacationId}\`.family_document_types fdt ON fd.doc_type_id = fdt.id
   WHERE fd.family_id = ?`;

const getDocById = (vacationId) =>
  `SELECT * FROM \`trip_tracker_${vacationId}\`.family_documents WHERE id = ?`;

/**
 * Returns per-family doc status: total members × required types vs uploaded count.
 * Joined so we get family_name alongside.
 */
const getAllFamiliesDocStatus = (vacationId) =>
  `SELECT
     f.family_id,
     f.family_name,
     COUNT(DISTINCT g.user_id) AS member_count,
     COUNT(DISTINCT fdt.id)    AS type_count,
     COUNT(DISTINCT g.user_id) * COUNT(DISTINCT fdt.id) AS total_required,
     COUNT(DISTINCT CONCAT(fd.user_id, '-', fd.doc_type_id)) AS uploaded_count
   FROM \`trip_tracker_${vacationId}\`.families f
   LEFT JOIN \`trip_tracker_${vacationId}\`.guest g ON g.family_id = f.family_id
   LEFT JOIN \`trip_tracker_${vacationId}\`.family_document_types fdt ON fdt.is_required = 1
   LEFT JOIN \`trip_tracker_${vacationId}\`.family_documents fd
          ON fd.family_id = f.family_id
         AND fd.user_id    = g.user_id
         AND fd.doc_type_id = fdt.id
   GROUP BY f.family_id, f.family_name`;

const getFamilyByToken = (vacationId) =>
  `SELECT family_id, family_name FROM \`trip_tracker_${vacationId}\`.families WHERE doc_token = ?`;

const getFamilyMembers = (vacationId) =>
  `SELECT user_id, hebrew_first_name, hebrew_last_name FROM \`trip_tracker_${vacationId}\`.guest WHERE family_id = ?`;

const getFamilyDocToken = (vacationId) =>
  `SELECT doc_token FROM \`trip_tracker_${vacationId}\`.families WHERE family_id = ?`;

module.exports = {
  getDocumentTypes,
  addDocumentType,
  deleteDocumentType,
  insertDocument,
  deleteDocument,
  getDocsByFamily,
  getDocById,
  getAllFamiliesDocStatus,
  getFamilyByToken,
  getFamilyMembers,
  getFamilyDocToken,
};
