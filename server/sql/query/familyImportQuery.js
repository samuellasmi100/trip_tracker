// Read-only lookups used by the Excel family-import flow. Writes reuse the
// families/userRooms layers, so this query module only fetches the data the
// import service needs to map rows: existing families (dedup), and the valid
// room ids (so a non-existent room number is reported, not FK-crashed).

const getExistingFamilies = (vacationId) =>
  `SELECT family_id, family_name FROM trip_tracker_${vacationId}.families`;

const getValidRoomIds = (vacationId) =>
  `SELECT rooms_id FROM trip_tracker_${vacationId}.rooms`;

module.exports = {
  getExistingFamilies,
  getValidRoomIds,
};
