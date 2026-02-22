const leadsDb = require('./leadsDb');

const getAll = async (vacationId) => {
  return await leadsDb.getAll(vacationId);
};

const getById = async (vacationId, leadId) => {
  const lead = await leadsDb.getById(vacationId, leadId);
  if (!lead) return null;
  const notes = await leadsDb.getNotesByLeadId(vacationId, leadId);
  return { ...lead, notes };
};

const getSummary = async (vacationId) => {
  return await leadsDb.getSummary(vacationId);
};

const create = async (vacationId, data) => {
  const result = await leadsDb.create(vacationId, data);
  return await leadsDb.getById(vacationId, result.insertId);
};

const update = async (vacationId, leadId, data) => {
  // Auto-set is_active based on terminal statuses
  if (data.status === 'registered' || data.status === 'not_relevant') {
    data.is_active = 0;
  } else if (data.status && data.is_active === undefined) {
    data.is_active = 1;
  }
  await leadsDb.update(vacationId, leadId, data);
  return await leadsDb.getById(vacationId, leadId);
};

const remove = async (vacationId, leadId) => {
  return await leadsDb.remove(vacationId, leadId);
};

const addNote = async (vacationId, leadId, noteText, createdBy) => {
  await leadsDb.addNote(vacationId, leadId, noteText, createdBy);
  return await leadsDb.getNotesByLeadId(vacationId, leadId);
};

module.exports = {
  getAll,
  getById,
  getSummary,
  create,
  update,
  remove,
  addNote,
};
