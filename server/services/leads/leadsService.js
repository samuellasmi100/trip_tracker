const leadsDb = require('./leadsDb');

// Columns the importer is allowed to diff/update from a row.
// Excludes free-text-only fields the file doesn't carry (email, family_size,
// referred_by, assigned_to) so we never blank them on update.
const IMPORTABLE_COLUMNS = [
  'full_name', 'phone', 'status', 'notes',
  'followup_date', 'last_contact_date',
  'price', 'discount', 'training', 'composition',
];

// Normalize phone for dedupe: digits-only; re-add leading 0 to 9-digit Israeli
// mobiles that lost it during Excel numeric coercion. Returns null if no
// digits at all.
const normalizePhone = (raw) => {
  if (raw == null) return null;
  const digits = String(raw).replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 9 && digits.startsWith('5')) return `0${digits}`;
  return digits;
};

// Compare a file value vs a DB value for a column. Empty-from-file means
// "no information" — we do NOT treat that as a change.
const valuesEqual = (col, fileVal, dbVal) => {
  if (fileVal === null || fileVal === undefined || fileVal === '') return true;
  if (dbVal === null || dbVal === undefined) return false;
  if (col === 'price' || col === 'discount') {
    return Number(fileVal) === Number(dbVal);
  }
  if (col === 'followup_date' || col === 'last_contact_date') {
    // DB returns a Date object or 'YYYY-MM-DD' string depending on driver.
    const dbStr = dbVal instanceof Date
      ? dbVal.toISOString().slice(0, 10)
      : String(dbVal).slice(0, 10);
    return String(fileVal) === dbStr;
  }
  return String(fileVal).trim() === String(dbVal).trim();
};

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

const getFollowupDueCount = async (vacationId) => {
  return await leadsDb.getFollowupDueCount(vacationId);
};

const importRows = async (vacationId, rows) => {
  if (!Array.isArray(rows)) {
    throw new Error('rows must be an array');
  }

  // Index existing leads by normalized phone for O(1) dedupe.
  const existing = await leadsDb.getAll(vacationId);
  const phoneIndex = new Map();
  for (const lead of existing) {
    const norm = normalizePhone(lead.phone);
    if (norm) phoneIndex.set(norm, lead);
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const raw of rows) {
    const row = { ...raw };
    row.phone = normalizePhone(row.phone);

    if (!row.full_name && !row.phone) {
      skipped += 1;
      continue;
    }

    const match = row.phone ? phoneIndex.get(row.phone) : null;

    if (!match) {
      await leadsDb.create(vacationId, {
        full_name: row.full_name || row.phone || 'ללא שם',
        phone: row.phone,
        status: row.status || 'new_interest',
        source: 'phone',
        notes: row.notes || null,
        followup_date:     row.followup_date     || null,
        last_contact_date: row.last_contact_date || null,
        price:    row.price    ?? null,
        discount: row.discount ?? null,
        training:    row.training    || null,
        composition: row.composition || null,
      });
      created += 1;
      continue;
    }

    // Diff: build a payload of only the fields the file actually changes.
    const diff = {};
    for (const col of IMPORTABLE_COLUMNS) {
      if (row[col] === undefined || row[col] === null || row[col] === '') continue;
      if (!valuesEqual(col, row[col], match[col])) {
        diff[col] = row[col];
      }
    }

    if (Object.keys(diff).length === 0) {
      skipped += 1;
      continue;
    }

    // Auto-flip is_active for terminal statuses, mirroring the regular update flow.
    if (diff.status === 'registered' || diff.status === 'not_relevant') {
      diff.is_active = 0;
    }
    await leadsDb.update(vacationId, match.lead_id, diff);
    updated += 1;
  }

  return { created, updated, skipped };
};

module.exports = {
  getAll,
  getById,
  getSummary,
  create,
  update,
  remove,
  addNote,
  getFollowupDueCount,
  importRows,
};
