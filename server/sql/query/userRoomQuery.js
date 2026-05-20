const getFamilyRoom = (vacationId) => {
  return `
      SELECT 
        r.rooms_id,
        r.type,
        r.size,
        r.direction,
        r.floor,
        r.base_occupancy,
        COALESCE(ura.people_count, 0) AS peopleCount
    FROM trip_tracker_${vacationId}.rooms r
    JOIN trip_tracker_${vacationId}.room_taken frd
        ON frd.room_id = r.rooms_id
    LEFT JOIN (
        SELECT 
            room_id, 
            COUNT(*) AS people_count
        FROM trip_tracker_${vacationId}.user_room_assignments
        GROUP BY room_id
    ) ura
        ON ura.room_id = r.rooms_id
    WHERE frd.family_id = ?`;
};

const assignMainRoom = (vacationId) => {
  return `
    INSERT INTO trip_tracker_${vacationId}.room_taken(family_id,room_id,start_date,end_date) VALUES(?,?,?,?)`;
};

const getAllChosenRoom = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.room_taken;`;
};

const getChosenRoom = (vacationId) => {
  return `SELECT r.rooms_id,r.type,r.size,r.direction,r.floor,r.base_occupancy,r.max_occupancy
    FROM trip_tracker_${vacationId}.rooms r 
    join trip_tracker_${vacationId}.user_room_assignments ur
    on ur.room_id = r.rooms_id
    where ur.user_id = ?`;
};

const getUsersChosenRoom = (vacationId) => {
  return `SELECT 
    ura.room_id,
    ura.family_id,
    ura.user_id,
    r.base_occupancy,
    r.max_occupancy,
    COUNT(ura.user_id) OVER (PARTITION BY ura.room_id) AS people_count
FROM trip_tracker_${vacationId}.user_room_assignments ura
JOIN trip_tracker_${vacationId}.rooms r 
    ON r.rooms_id = ura.room_id
WHERE family_id = ?;
;`

};

const removeMainRoom = (vacationId) => {
  return `
       DELETE FROM trip_tracker_${vacationId}.room_taken WHERE family_id= ?`;
};

const removeMainRoomByRoomId = (vacationId) => {
  return `
       DELETE FROM trip_tracker_${vacationId}.room_taken WHERE room_id = ? AND family_id= ?`;
};

const assignRoom = (vacationId) => {
  return `
      INSERT INTO trip_tracker_${vacationId}.user_room_assignments(user_id,room_id,family_id) VALUES(?,?,?)`;
};

const updateAssignRoom = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.user_room_assignments
       SET room_id = ? where user_id = ?`;
};

const removeAllUserAssignRoom = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.user_room_assignments WHERE family_id = ? `;
};

const removeAllUserAssignFromRoomId = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.user_room_assignments WHERE room_id = ? And family_id = ? `;
};

const removeUserAssignMainRoom = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.user_room_assignments WHERE user_id = ?`;
};

const updateStartEndAndDate = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.room_taken
       SET start_date = ?, end_date = ? where family_id = ?`;
};

// Move a family's room booking to a different room
const moveRoomBooking = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.room_taken
    SET room_id = ?
    WHERE family_id = ? AND room_id = ?`;
};

// Move all guest assignments from one room to another (for the same family)
const moveGuestAssignments = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.user_room_assignments
    SET room_id = ?
    WHERE family_id = ? AND room_id = ?`;
};

// Overlap probe: find any existing room_taken bookings for `?roomId` whose
// date range collides with `?startNew .. ?endNew` under the EXCLUSIVE-end
// (hotel turnover) convention. Touching at an endpoint is NOT overlap.
//   NOT (existing.end_date <= start_new OR existing.start_date >= end_new)
// FOR UPDATE locks the matching rows for the duration of the surrounding tx,
// so two concurrent assignments racing for the same room/dates can't both
// pass their check and then both insert.
const findOverlappingBookings = (vacationId) => {
  return `SELECT id, family_id, room_id,
            DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
            DATE_FORMAT(end_date,   '%Y-%m-%d') AS end_date
          FROM trip_tracker_${vacationId}.room_taken
          WHERE room_id = ?
            AND NOT (end_date <= ? OR start_date >= ?)
          FOR UPDATE`;
};

// Lightweight "which rooms is this family currently in" — only the room_id is
// needed by the assignment service. Aliased to rooms_id to match the field
// name the service uses elsewhere.
const getFamilyRoomIds = (vacationId) => {
  return `SELECT room_id AS rooms_id
          FROM trip_tracker_${vacationId}.room_taken
          WHERE family_id = ?`;
};

module.exports = {
  assignMainRoom,
  getFamilyRoom,
  removeMainRoom,
  assignRoom,
  getChosenRoom,
  updateAssignRoom,
  removeUserAssignMainRoom,
  removeAllUserAssignRoom,
  getUsersChosenRoom,
  updateStartEndAndDate,
  removeMainRoomByRoomId,
  removeAllUserAssignFromRoomId,
  getAllChosenRoom,
  moveRoomBooking,
  moveGuestAssignments,
  findOverlappingBookings,
  getFamilyRoomIds,
};
