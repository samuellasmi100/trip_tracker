const getAll = (vacationId) => {
return `SELECT 
    r.*, 
    f.*,  
    COUNT(ura.user_id) AS people_count
FROM 
    trip_tracker_${vacationId}.rooms r
LEFT JOIN 
    trip_tracker_${vacationId}.room_taken rt
    ON r.rooms_id = rt.room_id
LEFT JOIN 
    trip_tracker_${vacationId}.families f
    ON rt.family_id = f.family_id
LEFT JOIN 
    trip_tracker_${vacationId}.user_room_assignments ura
    ON r.rooms_id = ura.room_id 
GROUP BY 
    r.rooms_id, f.family_id;
`
// return `

// SELECT 
//     r.*, 
//     COUNT(ura.user_id) AS number_of_people,
//     f.*  
// FROM 
//     trip_tracker_${vacationId}.rooms r
// LEFT JOIN 
//     trip_tracker_${vacationId}.user_room_assignments ura
//     ON r.rooms_id = ura.room_id
// LEFT JOIN 
//     trip_tracker_${vacationId}.families f
//     ON ura.family_id = f.family_id
// GROUP BY 
//     r.rooms_id, f.family_id;  
// `
  // return `SELECT rooms_id ,type,size,direction,floor,base_occupancy,max_occupancy FROM trip_tracker_${vacationId}.rooms;`
}

const getRoomDetailsWithCounts = () => {
return `SELECT 
    r.*,
    COUNT(ura.user_id) AS number_of_people
FROM 
    rooms r
LEFT JOIN 
    user_room_assignments ura
ON 
    r.rooms_id = ura.room_id
GROUP BY 
    r.rooms_id;
`
}

const updateRoom = (roomData,id,vacationId) => {

  return `UPDATE trip_tracker_${vacationId}.rooms SET ${Object.keys(roomData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE rooms_id = ${id}`
}

const getRoomAvailable = (vacationId) => {
  return `
    SELECT r.*
FROM trip_tracker_${vacationId}.rooms r
LEFT JOIN trip_tracker_${vacationId}.room_taken rt
ON r.rooms_id = rt.room_id
   AND NOT (
       rt.end_date < ? 
       OR rt.start_date > ? 
   )
WHERE rt.room_id IS NULL; 
`
 }

const getUnAvailableDates = (vacationId) => {
  return `SELECT 
    DATE_SUB(start_date, INTERVAL 1 DAY) AS start_date,
    end_date,
    room_id 
FROM 
trip_tracker_${vacationId}.room_taken;
`
}

module.exports = {
  getAll,
  getRoomDetailsWithCounts,
  updateRoom,
  getRoomAvailable,
  getUnAvailableDates
}

