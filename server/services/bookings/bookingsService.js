'use strict';

const db = require('./bookingsDb');

const getFamilyByToken = (vacationId, docToken) => db.getFamilyByToken(vacationId, docToken);

const getExistingSubmission = (vacationId, familyId) => db.getExistingSubmission(vacationId, familyId);

const getGuestsBySubmission = (vacationId, submissionId) => db.getGuestsBySubmission(vacationId, submissionId);

const insertSubmission = (vacationId, data) => db.insertSubmission(vacationId, data);

const insertGuest = (vacationId, submissionId, guest, order) => db.insertGuest(vacationId, submissionId, guest, order);

const getAllStatus = (vacationId) => db.getAllStatus(vacationId);

const getByFamily = (vacationId, familyId) => db.getByFamily(vacationId, familyId);

module.exports = {
  getFamilyByToken,
  getExistingSubmission,
  getGuestsBySubmission,
  insertSubmission,
  insertGuest,
  getAllStatus,
  getByFamily,
};
