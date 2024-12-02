const getFamilyRoom = () => {
    return `
      SELECT 
        r.rooms_id AS roomId,
        r.type AS roomType,
        r.size AS roomSize,
        r.direction AS roomDirection,
        r.floor AS roomFloor,
        r.base_occupancy,
        COALESCE(ura.people_count, 0) AS peopleCount
    FROM rooms r
    JOIN family_room_details frd
        ON frd.room_id = r.rooms_id
    LEFT JOIN (
        SELECT 
            room_id, 
            COUNT(*) AS people_count
        FROM user_room_assignments
        GROUP BY room_id
    ) ura
        ON ura.room_id = r.rooms_id
    WHERE frd.family_id = ?`
    }
    
    const assignMainRoom = () => {
      return `
      INSERT INTO family_room_details(family_id,room_id) VALUES(?,?)`;
    }
    
    const assignRoom = () => {
      return `
      INSERT INTO user_room_assignments(user_id,room_id,family_id) VALUES(?,?,?)`;
    }
    
    const getChossenRoom = () => {
      return `SELECT r.rooms_id as roomId,r.type as roomType,r.size as roomSize,r.direction as roomDirection,r.floor as roomFloor,base_occupancy 
    FROM rooms r 
    join user_room_assignments ur
    on ur.room_id = r.rooms_id
    where ur.user_id = ?`
    }
    
    const getAllUserRooms = () => {
      return `SELECT room_id as roomId,family_id,user_id as userId FROM user_room_assignments where family_id = ?`
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
    