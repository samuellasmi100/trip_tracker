const addVacation = () => {
  return `INSERT INTO trip_tracker.vacations (name,vacation_id) VALUES (?,?)`;
};

const addVacationDates = () => {
  return `INSERT INTO trip_tracker.vacation_date (vacation_id,start_date,end_date,name) VALUES(?,?,?,?)`;
};
const getVacations = () => {
  return `SELECT name,vacation_id FROM trip_tracker.vacations`
}
// `id` is selected so the client can target a single part (e.g. for deletion);
// every other consumer reads name/dates and is unaffected by the extra column.
const getVacationDates = () => {
  return `SELECT id,name,vacation_id,start_date,end_date FROM trip_tracker.vacation_date where vacation_id = ?`;
};
const getAllVacationDates = () => {
  return `SELECT id,name,vacation_id,start_date,end_date FROM trip_tracker.vacation_date`;
};

// One part row by id — the delete flow loads the part's name/dates from here
// before deciding whether anything is still assigned to it.
const getVacationPartById = () => {
  return `SELECT id,vacation_id,start_date,end_date,name FROM trip_tracker.vacation_date WHERE id = ?`;
};

// Guests still assigned to a part. There is no FK; the link is the part NAME
// copied into guest.week_chosen at selection time, so the match is by name.
const getGuestsOnPart = (vacationId) => {
  return `SELECT hebrew_first_name,hebrew_last_name FROM trip_tracker_${vacationId}.guest WHERE week_chosen = ?`;
};

// Families whose chosen range matches the part. families.start_date/end_date are
// copied from the part and stored in the same string format, so direct equality
// mirrors the app's own week-matching logic (GuestEditor).
const getFamiliesOnPartDates = (vacationId) => {
  return `SELECT family_name FROM trip_tracker_${vacationId}.families WHERE start_date = ? AND end_date = ?`;
};

// Targeted single-row delete by id. Never rebuild/renumber the route list —
// the positional names ("שבוע N") would otherwise silently re-map every guest
// whose week_chosen no longer lines up.
const deleteVacationPart = () => {
  return `DELETE FROM trip_tracker.vacation_date WHERE id = ?`;
};

// Rename the existing vacation in place (by its existing vacation_id). The
// update flow targets the existing id — it never creates a new vacation/tenant DB.
const updateVacation = () => {
  return `UPDATE trip_tracker.vacations SET name = ? WHERE vacation_id = ?`;
};

// Edit one existing part's dates by id, leaving its name untouched. Preserving
// the name is what keeps already-assigned parts ("שבוע N") from renumbering.
const updateVacationDate = () => {
  return `UPDATE trip_tracker.vacation_date SET start_date = ?, end_date = ? WHERE id = ?`;
};

module.exports = {
  addVacation,
  addVacationDates,
  getVacations,
  getVacationDates,
  getAllVacationDates,
  getVacationPartById,
  getGuestsOnPart,
  getFamiliesOnPartDates,
  deleteVacationPart,
  updateVacation,
  updateVacationDate
};
