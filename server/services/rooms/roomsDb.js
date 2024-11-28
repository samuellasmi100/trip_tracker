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

const assignMainRoom = async (userId,roomId) => {
 
  try {
    const sql = roomsQuery.assignMainRoom()
    const parameters = [userId,roomId]
    console.log(parameters)
     await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}

const assignRoom = async (userId,roomId,familyId,status) => {
  try {
    let sql
    let parameters;
     let isGuestAlradyChoosRoom = await getChossenRoom(userId)
     if(isGuestAlradyChoosRoom.length > 0){
      if(isGuestAlradyChoosRoom[0].roomId === roomId && status === false){
        sql = roomsQuery.removeUserAssignRoom()
        parameters = [userId]
      }else {
        sql = roomsQuery.updateAssignRoom()
        parameters = [roomId,userId]
      }
      
     }else {
       sql = roomsQuery.assignRoom()
        parameters = [userId,roomId,familyId]
     }
    await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}

const updateAssignRoom = async (userId,roomId) => {
  try {
    let sql  = roomsQuery.updateAssignRoom()
    const parameters = [roomId,userId]
    await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}

const updateMainRoom = async (roomDetails,userId) => {
 
  try {
    const sql = `
    INSERT INTO parent_room_details (room_id, userId)
    VALUES ${roomDetails.map(() => '(?, ?)').join(', ')}
    ON DUPLICATE KEY UPDATE room_id = VALUES(room_id);`;
    const parameters = roomDetails.flatMap((room) => [room.roomId,userId]);
    await connection.executeWithParameters(sql,parameters)

  } catch (error) { 
    console.log(error)
  }
}

const removeMainRoom = async (userId) => {
  try {
    const sql = roomsQuery.removeMainRoom()
    const parameters = [userId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const getFamilyRoom = async (id) => {
  try {
    const sql = roomsQuery.getFamilyRoom()
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
  try {
    let sql = roomsQuery.lockRoom()
     const parameters = [1,roomId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const getChossenRoom = async (userId) => {

  try {
    let sql = roomsQuery.getChossenRoom()
     const parameters = [userId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}

const getAllUserRooms = async (familyId) => {
  try {
    let sql = roomsQuery.getAllUserRooms()
    const parameters = [familyId]
    const response = await connection.executeWithParameters(sql,parameters)
     return response
 } catch (error) { 
   console.log(error)
 }
}

const removeUserAssignMainRoom = async (familyId) => {
  try {
     let sql = roomsQuery.removeUserAssignMainRoom()
     const parameters = [familyId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}

const removeAllUserAssignRoom = async (familyId,roomId) => {
  try {
     let sql = roomsQuery.removeAllUserAssignRoom()
     const parameters = [roomId,familyId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}

module.exports = {
  getAll,
  assignMainRoom,
  getFamilyRoom,
  updateMainRoom,
  removeMainRoom,
  unLockRoom,
  lockRoom,
  assignRoom,
  getChossenRoom,
  updateAssignRoom,
  removeUserAssignMainRoom,
  removeAllUserAssignRoom,
  getAllUserRooms
}