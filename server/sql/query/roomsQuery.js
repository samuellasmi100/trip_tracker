

const getAll = () => {
  return `SELECT rooms_id as roomId,type as roomType,size as roomSize,direction as roomDirection,floor as roomFloor FROM rooms WHERE is_taken = 0;`
}
const getParentRoom = () => {
  return `
    SELECT r.rooms_id as roomId,r.type as roomType,r.size as roomSize,r.direction as roomDirection,r.floor as roomFloor 
FROM rooms r 
join parent_room_details prd
on prd.room_id = r.rooms_id
where prd.parent_id = ?`
}
const assignMainRoom = () => {
  return `
  INSERT INTO parent_room_details(parent_id,room_id) VALUES(?,?)`;
}
const updateMainRoom = () => {

  return  `
  INSERT INTO parent_room_details (room_id, parent_id)
  VALUES ${roomDetails.map(() => '(?, ?)').join(', ')}
  ON DUPLICATE KEY UPDATE room_id = VALUES(room_id);
`;
}
const removeMainRoom = () => {
  return `
   DELETE FROM parent_room_details WHERE parent_id= ?`;
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
  getAll,
  assignMainRoom,
  lockRoom,
  getParentRoom,
  updateMainRoom,
  removeMainRoom,
  unLockRoom
}

