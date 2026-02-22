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

const deleteDocument = async (vacationId, docId) => {
  try {
    return await connection.executeWithParameters(q.deleteDocument(vacationId), [docId]);
  } catch (error) {
    logger.error(`documentsDb.deleteDocument: ${error.sqlMessage || error.message}`);
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

const getAllFamiliesDocStatus = async (vacationId) => {
  try {
    return await connection.execute(q.getAllFamiliesDocStatus(vacationId));
  } catch (error) {
    logger.error(`documentsDb.getAllFamiliesDocStatus: ${error.sqlMessage || error.message}`);
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
  deleteDocument,
  getDocsByFamily,
  getDocById,
  getAllFamiliesDocStatus,
  getFamilyByToken,
  getFamilyMembers,
  getFamilyDocToken,
};
