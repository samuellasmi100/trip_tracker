const connection = require('../../db/connection-wrapper');
const leadsQuery = require('../../sql/query/leadsQuery');
const logger = require('../../utils/logger');

const getAll = async (vacationId) => {
  try {
    const sql = leadsQuery.getAll(vacationId);
    return await connection.execute(sql);
  } catch (error) {
    logger.error(`leadsDb.getAll: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getById = async (vacationId, leadId) => {
  try {
    const sql = leadsQuery.getById(vacationId);
    const rows = await connection.executeWithParameters(sql, [leadId]);
    return rows[0] || null;
  } catch (error) {
    logger.error(`leadsDb.getById: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getNotesByLeadId = async (vacationId, leadId) => {
  try {
    const sql = leadsQuery.getNotesByLeadId(vacationId);
    return await connection.executeWithParameters(sql, [leadId]);
  } catch (error) {
    logger.error(`leadsDb.getNotesByLeadId: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const create = async (vacationId, data) => {
  try {
    const sql = leadsQuery.create(vacationId);
    const params = [
      data.full_name,
      data.phone || null,
      data.email || null,
      data.family_size || 1,
      data.status || 'new_interest',
      data.source || 'phone',
      data.notes || null,
      data.referred_by || null,
    ];
    return await connection.executeWithParameters(sql, params);
  } catch (error) {
    logger.error(`leadsDb.create: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const update = async (vacationId, leadId, data) => {
  try {
    const filteredData = {};
    for (const key of leadsQuery.ALLOWED_LEAD_COLUMNS) {
      if (data[key] !== undefined) filteredData[key] = data[key];
    }
    const sql = leadsQuery.update(filteredData, vacationId);
    const params = [...Object.values(filteredData), leadId];
    return await connection.executeWithParameters(sql, params);
  } catch (error) {
    logger.error(`leadsDb.update: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const remove = async (vacationId, leadId) => {
  try {
    const sql = leadsQuery.remove(vacationId);
    return await connection.executeWithParameters(sql, [leadId]);
  } catch (error) {
    logger.error(`leadsDb.remove: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const addNote = async (vacationId, leadId, noteText, createdBy) => {
  try {
    const sql = leadsQuery.addNote(vacationId);
    return await connection.executeWithParameters(sql, [leadId, noteText, createdBy || null]);
  } catch (error) {
    logger.error(`leadsDb.addNote: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

const getSummary = async (vacationId) => {
  try {
    const sql = leadsQuery.getSummary(vacationId);
    const rows = await connection.execute(sql);
    return rows[0] || {};
  } catch (error) {
    logger.error(`leadsDb.getSummary: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

module.exports = {
  getAll,
  getById,
  getNotesByLeadId,
  create,
  update,
  remove,
  addNote,
  getSummary,
};
