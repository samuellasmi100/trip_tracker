'use strict';

const connection = require('../../db/connection-wrapper');
const q = require('../../sql/query/settingsQuery');
const logger = require('../../utils/logger');

const getAgreementText = async (vacationId) => {
  try {
    const rows = await connection.executeWithParameters(q.getAgreementText(), [vacationId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`settingsDb.getAgreementText: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const updateAgreementText = async (vacationId, text) => {
  try {
    return await connection.executeWithParameters(q.updateAgreementText(), [text || null, vacationId]);
  } catch (error) {
    logger.error(`settingsDb.updateAgreementText: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getFlightCompanies = async () => {
  try {
    return await connection.execute(q.getFlightCompanies());
  } catch (error) {
    logger.error(`settingsDb.getFlightCompanies: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const addFlightCompany = async (name) => {
  try {
    return await connection.executeWithParameters(q.addFlightCompany(), [name]);
  } catch (error) {
    logger.error(`settingsDb.addFlightCompany: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const deleteFlightCompany = async (id) => {
  try {
    return await connection.executeWithParameters(q.deleteFlightCompany(), [id]);
  } catch (error) {
    logger.error(`settingsDb.deleteFlightCompany: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

module.exports = { getAgreementText, updateAgreementText, getFlightCompanies, addFlightCompany, deleteFlightCompany };
