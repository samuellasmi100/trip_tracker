const ALLOWED_LEAD_COLUMNS = [
  'full_name', 'phone', 'email', 'family_size',
  'status', 'source', 'notes', 'referred_by', 'is_active', 'assigned_to',
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
  ORDER BY l.updated_at DESC;
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
    (full_name, phone, email, family_size, status, source, notes, referred_by)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?);
`;

const update = (data, vacationId) => {
  const safeKeys = Object.keys(data).filter(k => ALLOWED_LEAD_COLUMNS.includes(k));
  if (safeKeys.length === 0) throw new Error('No valid columns to update');
  return `
    UPDATE trip_tracker_${vacationId}.leads
    SET ${safeKeys.map(k => `\`${k}\` = ?`).join(', ')}, updated_at = NOW()
    WHERE lead_id = ?;
  `;
};

const remove = (vacationId) => `
  DELETE FROM trip_tracker_${vacationId}.leads WHERE lead_id = ?;
`;

const addNote = (vacationId) => `
  INSERT INTO trip_tracker_${vacationId}.lead_notes (lead_id, note_text, created_by)
  VALUES (?, ?, ?);
`;

const getSummary = (vacationId) => `
  SELECT
    COUNT(*) AS total,
    SUM(is_active = 1) AS active,
    SUM(is_active = 0) AS closed,
    SUM(status = 'new_interest')  AS new_interest,
    SUM(status = 'no_answer')     AS no_answer,
    SUM(status = 'follow_up')     AS follow_up,
    SUM(status = 'meeting_scheduled') AS meeting_scheduled,
    SUM(status = 'interested')    AS interested,
    SUM(status = 'registered')    AS registered,
    SUM(status = 'not_relevant')  AS not_relevant
  FROM trip_tracker_${vacationId}.leads;
`;

module.exports = {
  ALLOWED_LEAD_COLUMNS,
  getAll,
  getById,
  getNotesByLeadId,
  create,
  update,
  remove,
  addNote,
  getSummary,
};
