'use strict';

const connection = require('../../db/connection-wrapper');
const q = require('../../sql/query/documentsQuery');
const logger = require('../../utils/logger');

const getDocumentTypes = async (vacationId) => {
  try {
    return await connection.execute(q.getDocumentTypes(vacationId));
  } catch (error) {
    logger.error(`documentsDb.getDocumentTypes: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const addDocumentType = async (vacationId, { type_key, label, sort_order }) => {
  try {
    return await connection.executeWithParameters(q.addDocumentType(vacationId), [type_key, label, sort_order]);
  } catch (error) {
    logger.error(`documentsDb.addDocumentType: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const deleteDocumentType = async (vacationId, typeId) => {
  try {
    return await connection.executeWithParameters(q.deleteDocumentType(vacationId), [typeId]);
  } catch (error) {
    logger.error(`documentsDb.deleteDocumentType: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

// Upsert (latest-only): replaces any existing file for the same
// (family_id, user_id, doc_type_id) via ON DUPLICATE KEY UPDATE.
const insertDocument = async (vacationId, { family_id, user_id, doc_type_id, file_name, file_path }) => {
  try {
    return await connection.executeWithParameters(q.insertDocument(vacationId), [
      family_id, user_id, doc_type_id, file_name, file_path,
    ]);
  } catch (error) {
    logger.error(`documentsDb.insertDocument: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getDocByFamilyUserType = async (vacationId, { family_id, user_id, doc_type_id }) => {
  try {
    const rows = await connection.executeWithParameters(q.getDocByFamilyUserType(vacationId), [family_id, user_id, doc_type_id]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`documentsDb.getDocByFamilyUserType: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const deleteDocument = async (vacationId, docId) => {
  try {
    return await connection.executeWithParameters(q.deleteDocument(vacationId), [docId]);
  } catch (error) {
    logger.error(`documentsDb.deleteDocument: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const deletePublicDocument = async (vacationId, docId, familyId) => {
  try {
    return await connection.executeWithParameters(q.deletePublicDocument(vacationId), [docId, familyId]);
  } catch (error) {
    logger.error(`documentsDb.deletePublicDocument: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getDocsByFamily = async (vacationId, familyId) => {
  try {
    return await connection.executeWithParameters(q.getDocsByFamily(vacationId), [familyId]);
  } catch (error) {
    logger.error(`documentsDb.getDocsByFamily: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getDocById = async (vacationId, docId) => {
  try {
    const rows = await connection.executeWithParameters(q.getDocById(vacationId), [docId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`documentsDb.getDocById: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getDocByIdWithType = async (vacationId, docId) => {
  try {
    const rows = await connection.executeWithParameters(q.getDocByIdWithType(vacationId), [docId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`documentsDb.getDocByIdWithType: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getAllFamilies = async (vacationId) => {
  try {
    return await connection.execute(q.getAllFamilies(vacationId));
  } catch (error) {
    logger.error(`documentsDb.getAllFamilies: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getGuestsForStatus = async (vacationId) => {
  try {
    return await connection.execute(q.getGuestsForStatus(vacationId));
  } catch (error) {
    logger.error(`documentsDb.getGuestsForStatus: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getUploadedDocsForStatus = async (vacationId) => {
  try {
    return await connection.execute(q.getUploadedDocsForStatus(vacationId));
  } catch (error) {
    logger.error(`documentsDb.getUploadedDocsForStatus: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getFamilyByToken = async (vacationId, docToken) => {
  try {
    const rows = await connection.executeWithParameters(q.getFamilyByToken(vacationId), [docToken]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`documentsDb.getFamilyByToken: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getFamilyMembers = async (vacationId, familyId) => {
  try {
    return await connection.executeWithParameters(q.getFamilyMembers(vacationId), [familyId]);
  } catch (error) {
    logger.error(`documentsDb.getFamilyMembers: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getFamilyDocToken = async (vacationId, familyId) => {
  try {
    const rows = await connection.executeWithParameters(q.getFamilyDocToken(vacationId), [familyId]);
    return rows[0]?.doc_token || null;
  } catch (error) {
    logger.error(`documentsDb.getFamilyDocToken: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

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
  getFamilyDocToken,
};
