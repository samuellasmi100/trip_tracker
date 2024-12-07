
  
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
    WHERE frd.family_id = ?`
  }
    
    const assignMainRoom = (vacationId) => {
      return `
      INSERT INTO trip_tracker_${vacationId}.room_taken(family_id,room_id,start_date,end_date) VALUES(?,?,?,?)`;
    }
    
    const assignRoom = (vacationId) => {
      return `
      INSERT INTO trip_tracker_${vacationId}.user_room_assignments(user_id,room_id,family_id) VALUES(?,?,?)`;
    }
    
    const getChossenRoom = (vacationId) => {
      return `SELECT r.rooms_id,r.type,r.size,r.direction,r.floor,base_occupancy 
    FROM trip_tracker_${vacationId}.rooms r 
    join trip_tracker_${vacationId}.user_room_assignments ur
    on ur.room_id = r.rooms_id
    where ur.user_id = ?`
    }
    
    const getAllUserRooms = (vacationId) => {
      return `SELECT room_id as roomId,family_id,user_id as userId FROM trip_tracker_${vacationId}.user_room_assignments where family_id = ?`
    }
    
    const updateMainRoom = () => {
      return  `
      INSERT INTO family_room_details (room_id, userId)
      VALUES ${roomDetails.map(() => '(?, ?)').join(', ')}
      ON DUPLICATE KEY UPDATE room_id = VALUES(room_id);
    `;
    }
    
    const updateAssignRoom = () => {
      return `UPDATE user_room_assignments SET room_id = ? where user_id = ?`
    }
    
    const removeUserAssignMainRoom = () => {
      return `DELETE FROM user_room_assignments where family_id = ?`
    }
    
    const removeAllUserAssignRoom = () => {
      return `DELETE FROM user_room_assignments where room_id = ? AND family_id = ? `
    }
    
    const removeUserAssignRoom = () => {
      return `DELETE FROM user_room_assignments where user_id = ? `
    }
    
    const removeMainRoom = () => {
      return `
       DELETE FROM family_room_details WHERE family_id= ?`;
    }
    
    const lockRoom = () => {
      return `
      update rooms set is_taken = ? where rooms_id = ?`;
    }
    
    const unLockRoom = () => {
      return `
      update rooms set is_taken = ? where rooms_id = ?`;
    }
    
    module.exports = {
      assignMainRoom,
      lockRoom,
      getFamilyRoom,
      updateMainRoom,
      removeMainRoom,
      unLockRoom,
      assignRoom,
      getChossenRoom,
      updateAssignRoom,
    removeUserAssignMainRoom,
    removeAllUserAssignRoom,
    getAllUserRooms,
    removeUserAssignRoom,
    }
    