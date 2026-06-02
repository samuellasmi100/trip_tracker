const ALLOWED_LEAD_COLUMNS = [
  'full_name', 'phone', 'email', 'family_size',
  'status', 'source', 'notes', 'referred_by', 'is_active', 'assigned_to',
  'followup_date', 'price', 'discount', 'training', 'composition',
  'highlight',
];

const getAll = (vacationId) => `
  SELECT
    l.*,
    (
      SELECT ln.note_text
      FROM trip_tracker_${vacationId}.lead_notes ln
      WHERE ln.lead_id = l.lead_id
      ORDER BY ln.created_at DESC
      LIMIT 1
    ) AS last_note,
    (
      SELECT ln.created_at
      FROM trip_tracker_${vacationId}.lead_notes ln
      WHERE ln.lead_id = l.lead_id
      ORDER BY ln.created_at DESC
      LIMIT 1
    ) AS last_note_at
  FROM trip_tracker_${vacationId}.leads l
  ORDER BY COALESCE(l.updated_at, l.created_at) DESC;
`;

const getById = (vacationId) => `
  SELECT l.*
  FROM trip_tracker_${vacationId}.leads l
  WHERE l.lead_id = ?;
`;

const getNotesByLeadId = (vacationId) => `
  SELECT *
  FROM trip_tracker_${vacationId}.lead_notes
  WHERE lead_id = ?
  ORDER BY created_at ASC;
`;

const create = (vacationId) => `
  INSERT INTO trip_tracker_${vacationId}.leads
    (full_name, phone, email, family_size, status, source, notes, referred_by,
     followup_date, price, discount, training, composition, highlight)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
`;

// bumpUpdatedAt=false suppresses the "updated_at = NOW()" clause — used by the
// Excel importer so a re-import never overwrites a lead's "last genuinely edited"
// timestamp. Every other caller (manual edits, status pills, date changes,
// mark-handled) keeps the default true.
const update = (data, vacationId, { bumpUpdatedAt = true } = {}) => {
  const safeKeys = Object.keys(data).filter(k => ALLOWED_LEAD_COLUMNS.includes(k));
  if (safeKeys.length === 0) throw new Error('No valid columns to update');
  const setClause = safeKeys.map(k => `\`${k}\` = ?`).join(', ');
  const updatedAtClause = bumpUpdatedAt ? ', updated_at = NOW()' : '';
  return `
    UPDATE trip_tracker_${vacationId}.leads
    SET ${setClause}${updatedAtClause}
    WHERE lead_id = ?;
  `;
};

const remove = (vacationId) => `
  DELETE FROM trip_tracker_${vacationId}.leads WHERE lead_id = ?;
`;

// Bulk wipe for the "delete all leads" admin action. lead_notes has no FK
// cascade to leads, so the caller must wipe notes first in the same
// transaction to avoid orphan rows.
const removeAll = (vacationId) => `
  DELETE FROM trip_tracker_${vacationId}.leads;
`;

const removeAllNotes = (vacationId) => `
  DELETE FROM trip_tracker_${vacationId}.lead_notes;
`;

const addNote = (vacationId) => `
  INSERT INTO trip_tracker_${vacationId}.lead_notes (lead_id, note_text, created_by)
  VALUES (?, ?, ?);
`;

const bumpUpdatedAt = (vacationId) => `
  UPDATE trip_tracker_${vacationId}.leads
  SET updated_at = NOW()
  WHERE lead_id = ?;
`;

const getSummary = (vacationId) => `
  SELECT
    COUNT(*) AS total,
    SUM(is_active = 1) AS active,
    SUM(is_active = 0) AS closed,
    SUM(status = 'new_interest') AS new_interest,
    SUM(status = 'follow_up')    AS follow_up,
    SUM(status = 'registered')   AS registered,
    SUM(status = 'not_relevant') AS not_relevant
  FROM trip_tracker_${vacationId}.leads;
`;

const getFollowupDueCount = (vacationId) => `
  SELECT COUNT(*) AS due_count
  FROM trip_tracker_${vacationId}.leads
  WHERE followup_date IS NOT NULL
    AND followup_date <= CURDATE()
    AND is_active = 1;
`;

const getByPhone = (vacationId) => `
  SELECT *
  FROM trip_tracker_${vacationId}.leads
  WHERE phone = ?
  LIMIT 1;
`;

const getByEmail = (vacationId) => `
  SELECT *
  FROM trip_tracker_${vacationId}.leads
  WHERE email = ?
  LIMIT 1;
`;

module.exports = {
  ALLOWED_LEAD_COLUMNS,
  getAll,
  getById,
  getNotesByLeadId,
  create,
  update,
  remove,
  removeAll,
  removeAllNotes,
  addNote,
  getSummary,
  getFollowupDueCount,
  getByPhone,
  getByEmail,
  bumpUpdatedAt,
};
