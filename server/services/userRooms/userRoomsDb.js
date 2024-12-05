const connection = require("../../db/connection-wrapper");
const userRoomQuery = require("../../sql/query/userRoomQuery")


const assignMainRoom = async (userId,roomId) => {
 
  try {
    const sql = userRoomQuery.assignMainRoom()
    const parameters = [userId,roomId]
     await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}

const assignRoom = async (userId,roomId,familyId,status) => {
  try {
    let sql
    let parameters;
     let isGuestAlreadyChosenRoom = await getChossenRoom(userId)
     if(isGuestAlreadyChosenRoom.length > 0){
      if(isGuestAlreadyChosenRoom[0].roomId === roomId && status === false){
        sql = userRoomQuery.removeUserAssignRoom()
        parameters = [userId]
      }else {
        sql = userRoomQuery.updateAssignRoom()
        parameters = [roomId,userId]
      }
      
     }else {
       sql = userRoomQuery.assignRoom()
        parameters = [userId,roomId,familyId]
     }
    await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}

const updateAssignRoom = async (userId,roomId) => {
  try {
    let sql  = userRoomQuery.updateAssignRoom()
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
    const sql = userRoomQuery.removeMainRoom()
    const parameters = [userId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const getFamilyRoom = async (id,vacationId) => {
  try {
    const sql = userRoomQuery.getFamilyRoom(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
   return response
     
   
  } catch (error) { 
    console.log(error)
  }
}

const unLockRoom = async (roomId) => {
  try {
    let sql = userRoomQuery.unLockRoom()
     const parameters = [0,roomId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const lockRoom = async (roomId) => {
  try {
    let sql = userRoomQuery.lockRoom()
     const parameters = [1,roomId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const getChossenRoom = async (userId) => {

  try {
    let sql = userRoomQuery.getChossenRoom()
     const parameters = [userId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}

const getAllUserRooms = async (familyId,vacationId) => {
  try {
    let sql = userRoomQuery.getAllUserRooms(vacationId)
    const parameters = [familyId]
    const response = await connection.executeWithParameters(sql,parameters)
     return response
 } catch (error) { 
   console.log(error)
 }
}

const removeUserAssignMainRoom = async (familyId) => {
  try {
     let sql = userRoomQuery.removeUserAssignMainRoom()
     const parameters = [familyId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}

const removeAllUserAssignRoom = async (familyId,roomId) => {
  try {
     let sql = userRoomQuery.removeAllUserAssignRoom()
     const parameters = [roomId,familyId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}

module.exports = {
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
  getAllUserRooms,
}