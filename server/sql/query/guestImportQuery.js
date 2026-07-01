// Read-only lookup for the hotel-guest Excel import. Writes reuse the
// families/users service layers, so this module only fetches the existing
// groups a box's surnames are matched against.

const getExistingGroups = (vacationId) =>
  `SELECT family_id, family_name FROM trip_tracker_${vacationId}.families`;

// Existing guests of one group — the basis for idempotent re-import: dedup
// identified guests by identity_id (ת.ז) and reserved slots by surname count.
const getGroupGuests = (vacationId) =>
  `SELECT user_id, identity_id, hebrew_last_name, english_last_name,
          hebrew_first_name, english_first_name, birth_date, age
   FROM trip_tracker_${vacationId}.guest WHERE family_id = ?`;

// Fill-empty-only update: caller passes the whitelist of columns that are blank
// in the DB but present in the sheet; existing values are never overwritten.
const fillEmptyGuestFields = (vacationId, columns) => {
  const sets = columns.map((c) => `${c} = ?`).join(", ");
  return `UPDATE trip_tracker_${vacationId}.guest SET ${sets} WHERE user_id = ?`;
};

module.exports = {
  getExistingGroups,
  getGroupGuests,
  fillEmptyGuestFields,
};
