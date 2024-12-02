const getAll = () => {
  return `SELECT rooms_id as roomId,type as roomType,size as roomSize,direction as roomDirection,floor as roomFloor FROM rooms WHERE is_taken = 0;`
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
const updateRoom = (roomData,id) => {

  return `UPDATE rooms SET ${Object.keys(roomData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE rooms_id = ${id}`
}
module.exports = {
  getAll,
  getRoomDetailsWithCounts,
  updateRoom
}

