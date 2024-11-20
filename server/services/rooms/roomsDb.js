const connection = require("../../db/connection-wrapper");
const roomsQuery = require("../../sql/query/roomsQuery")

const getAll = async () => {
    try {
      const sql = roomsQuery.getAll()
      const response = await connection.execute(sql)
      return response
     
    } catch (error) { 
      console.log(error)
    }
}

const assignMainRoom = async (parentId,roomId) => {
 
  try {
    const sql = roomsQuery.assignMainRoom()
    const parameters = [parentId,roomId]
     await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}
const updateMainRoom = async (roomDetails,parentId) => {
 
  try {
    const sql = `
    INSERT INTO parent_room_details (room_id, parent_id)
    VALUES ${roomDetails.map(() => '(?, ?)').join(', ')}
    ON DUPLICATE KEY UPDATE room_id = VALUES(room_id);`;
    const parameters = roomDetails.flatMap((room) => [room.roomId,parentId]);
    await connection.executeWithParameters(sql,parameters)

  } catch (error) { 
    console.log(error)
  }
}
const removeMainRoom = async (parentId) => {
  try {
    const sql = roomsQuery.removeMainRoom()
    const parameters = [parentId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}
const getParentRoom = async (id) => {
 
  try {
    const sql = roomsQuery.getParentRoom()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
   return response
     
   
  } catch (error) { 
    console.log(error)
  }
}

const unLockRoom = async (roomId) => {
  try {
    let sql = roomsQuery.unLockRoom()
     const parameters = [0,roomId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}
const lockRoom = async (roomId) => {
  console.log(roomId)
  try {
    let sql = roomsQuery.lockRoom()
     const parameters = [1,roomId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}
module.exports = {
  getAll,
  assignMainRoom,
  getParentRoom,
  updateMainRoom,
  removeMainRoom,
  unLockRoom,
  lockRoom
}