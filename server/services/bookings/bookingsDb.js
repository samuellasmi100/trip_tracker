'use strict';

const connection = require('../../db/connection-wrapper');
const q = require('../../sql/query/bookingsQuery');
const logger = require('../../utils/logger');

const getFamilyByToken = async (vacationId, docToken) => {
  try {
    const rows = await connection.executeWithParameters(q.getFamilyByToken(vacationId), [docToken]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`bookingsDb.getFamilyByToken: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getExistingSubmission = async (vacationId, familyId) => {
  try {
    const rows = await connection.executeWithParameters(q.getExistingSubmission(vacationId), [familyId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`bookingsDb.getExistingSubmission: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getGuestsBySubmission = async (vacationId, submissionId) => {
  try {
    return await connection.executeWithParameters(q.getGuestsBySubmission(vacationId), [submissionId]);
  } catch (error) {
    logger.error(`bookingsDb.getGuestsBySubmission: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const insertSubmission = async (vacationId, data) => {
  try {
    return await connection.executeWithParameters(q.insertSubmission(vacationId), [
      data.family_id,
      data.contact_name || null,
      data.contact_phone || null,
      data.contact_email || null,
      data.contact_address || null,
      data.payment_preference || null,
      data.special_requests || null,
    ]);
  } catch (error) {
    logger.error(`bookingsDb.insertSubmission: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const insertGuest = async (vacationId, submissionId, guest, order) => {
  try {
    return await connection.executeWithParameters(q.insertGuest(vacationId), [
      submissionId,
      guest.fullNameHe || null,
      guest.fullNameEn || null,
      guest.passportNumber || null,
      guest.passportExpiry || null,
      guest.dateOfBirth || null,
      guest.gender || null,
      guest.foodPreference || null,
      order,
    ]);
  } catch (error) {
    logger.error(`bookingsDb.insertGuest: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getAllStatus = async (vacationId) => {
  try {
    return await connection.execute(q.getAllStatus(vacationId));
  } catch (error) {
    logger.error(`bookingsDb.getAllStatus: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getByFamily = async (vacationId, familyId) => {
  try {
    const rows = await connection.executeWithParameters(q.getByFamily(vacationId), [familyId]);
    const submission = rows[0] || null;
    if (!submission) return null;
    const guests = await getGuestsBySubmission(vacationId, submission.id);
    return { ...submission, guests };
  } catch (error) {
    logger.error(`bookingsDb.getByFamily: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

module.exports = {
  getFamilyByToken,
  getExistingSubmission,
  getGuestsBySubmission,
  insertSubmission,
  insertGuest,
  getAllStatus,
  getByFamily,
};
