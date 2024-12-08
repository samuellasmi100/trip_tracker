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

const getChosenRoom = (vacationId) => {
  return `SELECT r.rooms_id,r.type,r.size,r.direction,r.floor,base_occupancy 
    FROM trip_tracker_${vacationId}.rooms r 
    join trip_tracker_${vacationId}.user_room_assignments ur
    on ur.room_id = r.rooms_id
    where ur.user_id = ?`;
};

const getUsersChosenRoom = (vacationId) => {
  return `SELECT room_id ,family_id,user_id FROM trip_tracker_${vacationId}.user_room_assignments where family_id = ?`;
};

const updateMainRoom = () => {
  return `
      INSERT INTO family_room_details (room_id, userId)
      VALUES ${roomDetails.map(() => "(?, ?)").join(", ")}
      ON DUPLICATE KEY UPDATE room_id = VALUES(room_id);
    `;
};

const removeMainRoom = (vacationId) => {
  return `
       DELETE FROM trip_tracker_${vacationId}.room_taken WHERE family_id= ?`;
};

const assignRoom = (vacationId) => {
  return `
      INSERT INTO trip_tracker_${vacationId}.user_room_assignments(user_id,room_id,family_id) VALUES(?,?,?)`;
};

const updateAssignRoom = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.user_room_assignments
      s SET room_id = ? where user_id = ?`;
};

const removeAllUserAssignRoom = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.user_room_assignments where family_id = ? `;
};

const removeUserAssignMainRoom = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.user_room_assignments where user_id = ?`;
};

module.exports = {
  assignMainRoom,
  getFamilyRoom,
  updateMainRoom,
  removeMainRoom,
  assignRoom,
  getChosenRoom,
  updateAssignRoom,
  removeUserAssignMainRoom,
  removeAllUserAssignRoom,
  getUsersChosenRoom,
};
