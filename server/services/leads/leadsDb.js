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
      data.followup_date     || null,
      data.last_contact_date || null,
      data.price             != null && data.price !== ''     ? data.price    : null,
      data.discount          != null && data.discount !== ''  ? data.discount : null,
      data.training          || null,
      data.composition       || null,
    ];
    return await connection.executeWithParameters(sql, params);
  } catch (error) {
    logger.error(`leadsDb.create: ${error.sqlMessage || error.message}`);
    throw error;
  }
};

// Columns where empty string from the UI means "clear it" — coerce to null
// so MySQL accepts the value (DATE / DECIMAL reject '').
const NULLABLE_ON_BLANK = new Set([
  'followup_date', 'last_contact_date', 'price', 'discount',
  'training', 'composition', 'referred_by', 'email', 'phone', 'notes',
]);

const update = async (vacationId, leadId, data) => {
  try {
    const filteredData = {};
    for (const key of leadsQuery.ALLOWED_LEAD_COLUMNS) {
      if (data[key] === undefined) continue;
      let value = data[key];
      if (value === '' && NULLABLE_ON_BLANK.has(key)) value = null;
      filteredData[key] = value;
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
    // Atomically insert the note and bump the parent lead's updated_at so the
    // "last updated" timestamp reflects note activity. Both commit or both roll back.
    return await connection.withTransaction(async (tx) => {
      const insertSql = leadsQuery.addNote(vacationId);
      await tx.executeWithParameters(insertSql, [leadId, noteText, createdBy || null]);

      const bumpSql = leadsQuery.bumpUpdatedAt(vacationId);
      await tx.executeWithParameters(bumpSql, [leadId]);
      return null;
    });
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

const getFollowupDueCount = async (vacationId) => {
  try {
    const sql = leadsQuery.getFollowupDueCount(vacationId);
    const rows = await connection.execute(sql);
    return Number(rows?.[0]?.due_count ?? 0);
  } catch (error) {
    logger.error(`leadsDb.getFollowupDueCount: ${error.sqlMessage || error.message}`);
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
  getFollowupDueCount,
};
