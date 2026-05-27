'use strict';

const connection = require('../../db/connection-wrapper');
const q = require('../../sql/query/registrationsQuery');
const logger = require('../../utils/logger');

const getFamilyByFamilyId = async (vacationId, familyId) => {
  try {
    const rows = await connection.executeWithParameters(q.getFamilyByFamilyId(vacationId), [familyId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`registrationsDb.getFamilyByFamilyId: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getMainGuest = async (vacationId, familyId) => {
  try {
    const rows = await connection.executeWithParameters(q.getMainGuest(vacationId), [familyId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`registrationsDb.getMainGuest: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const hasSignedRegistration = async (vacationId, familyId) => {
  try {
    const rows = await connection.executeWithParameters(q.hasSignedRegistration(vacationId), [familyId]);
    return rows.length > 0;
  } catch (error) {
    logger.error(`registrationsDb.hasSignedRegistration: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getActivePendingRequest = async (vacationId, familyId) => {
  try {
    const rows = await connection.executeWithParameters(q.getActivePendingRequest(vacationId), [familyId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`registrationsDb.getActivePendingRequest: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const insertRegistrationRequest = async (vacationId, { familyId, guestId, token, expiresAt, createdBy }) => {
  try {
    return await connection.executeWithParameters(
      q.insertRegistrationRequest(vacationId),
      [familyId, guestId, token, expiresAt, createdBy]
    );
  } catch (error) {
    logger.error(`registrationsDb.insertRegistrationRequest: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getRegistrationByToken = async (vacationId, token) => {
  try {
    const rows = await connection.executeWithParameters(q.getRegistrationByToken(vacationId), [token]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`registrationsDb.getRegistrationByToken: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getFamilyForSnapshot = async (vacationId, familyId) => {
  try {
    const rows = await connection.executeWithParameters(q.getFamilyForSnapshot(vacationId), [familyId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`registrationsDb.getFamilyForSnapshot: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getGuestBirthDatesByFamily = async (vacationId, familyId) => {
  try {
    return await connection.executeWithParameters(q.getGuestBirthDatesByFamily(vacationId), [familyId]);
  } catch (error) {
    logger.error(`registrationsDb.getGuestBirthDatesByFamily: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const incrementVerifyAttempts = async (vacationId, token) => {
  try {
    return await connection.executeWithParameters(q.incrementVerifyAttempts(vacationId), [token]);
  } catch (error) {
    logger.error(`registrationsDb.incrementVerifyAttempts: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getDocTypeIdByKey = async (vacationId, typeKey) => {
  try {
    const rows = await connection.executeWithParameters(q.getDocTypeIdByKey(vacationId), [typeKey]);
    return rows[0]?.id || null;
  } catch (error) {
    logger.error(`registrationsDb.getDocTypeIdByKey: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

/**
 * Atomic submit write: UPDATE registration_requests (optimistic lock on
 * status='pending') + INSERT family_documents — both inside the caller's
 * existing transaction. The caller (registrationsService.submitRegistration)
 * opens the transaction via connection.withTransaction and passes `tx` in.
 *
 * Throws a plain Error with code='NOT_PENDING' when the UPDATE finds no row in
 * the expected state. Service translates to a typed RegistrationError. The
 * surrounding withTransaction will roll back any partial work on throw.
 */
const submitRegistrationWriteTx = async (tx, vacationId, params) => {
  const {
    token, signerIp, userAgent,
    r2SignatureKey, r2PdfKey, formDataJson,
    familyId, userIdForDocs, docTypeId, fileName, filePath,
  } = params;

  const updateResult = await tx.executeWithParameters(
    q.markSignedAfterSubmit(vacationId),
    [signerIp, userAgent, r2SignatureKey, r2PdfKey, formDataJson, token]
  );
  if (!updateResult || updateResult.affectedRows !== 1) {
    const err = new Error('Registration not in pending state');
    err.code = 'NOT_PENDING';
    throw err;
  }

  const insertResult = await tx.executeWithParameters(
    q.insertFamilyDocument(vacationId),
    [familyId, userIdForDocs, docTypeId, fileName, filePath]
  );

  return { docInsertId: insertResult.insertId };
};

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
  getDocTypeIdByKey,
  submitRegistrationWriteTx,
};
