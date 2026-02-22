'use strict';

const db = require('./signaturesDb');

const getAllStatus = async (vacationId) => db.getAllStatus(vacationId);

const getSignatureByFamily = async (vacationId, familyId) => db.getSignatureByFamily(vacationId, familyId);

const setSentAt = async (vacationId, familyId) => db.setSentAt(vacationId, familyId);

const deleteSignature = async (vacationId, familyId) => db.deleteSignature(vacationId, familyId);

const getFamilyByToken = async (vacationId, docToken) => db.getFamilyByToken(vacationId, docToken);

const insertSignature = async (vacationId, data) => db.insertSignature(vacationId, data);

module.exports = {
  getAllStatus,
  getSignatureByFamily,
  setSentAt,
  deleteSignature,
  getFamilyByToken,
  insertSignature,
};
