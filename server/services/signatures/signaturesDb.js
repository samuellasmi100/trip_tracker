'use strict';

const connection = require('../../db/connection-wrapper');
const q = require('../../sql/query/signaturesQuery');
const logger = require('../../utils/logger');

const getFamilyByToken = async (vacationId, docToken) => {
  try {
    const rows = await connection.executeWithParameters(q.getFamilyByToken(vacationId), [docToken]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`signaturesDb.getFamilyByToken: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getSignatureByFamily = async (vacationId, familyId) => {
  try {
    const rows = await connection.executeWithParameters(q.getSignatureByFamily(vacationId), [familyId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`signaturesDb.getSignatureByFamily: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const insertSignature = async (vacationId, { family_id, signer_name, signature_image_path, ip_address }) => {
  try {
    return await connection.executeWithParameters(q.insertSignature(vacationId), [
      family_id, signer_name, signature_image_path, ip_address || null,
    ]);
  } catch (error) {
    logger.error(`signaturesDb.insertSignature: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getAllStatus = async (vacationId) => {
  try {
    return await connection.execute(q.getAllStatus(vacationId));
  } catch (error) {
    logger.error(`signaturesDb.getAllStatus: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const setSentAt = async (vacationId, familyId) => {
  try {
    return await connection.executeWithParameters(q.setSentAt(vacationId), [familyId]);
  } catch (error) {
    logger.error(`signaturesDb.setSentAt: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const deleteSignature = async (vacationId, familyId) => {
  try {
    return await connection.executeWithParameters(q.deleteSignature(vacationId), [familyId]);
  } catch (error) {
    logger.error(`signaturesDb.deleteSignature: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

module.exports = {
  getFamilyByToken,
  getSignatureByFamily,
  insertSignature,
  getAllStatus,
  setSentAt,
  deleteSignature,
};
