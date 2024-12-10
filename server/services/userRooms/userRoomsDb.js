const connection = require("../../db/connection-wrapper");
const userRoomQuery = require("../../sql/query/userRoomQuery")


const assignMainRoom = async (vacationId,familyId,roomId,startDate,endDate) => {
 
  try {
    const sql = userRoomQuery.assignMainRoom(vacationId)
    const parameters = [familyId,roomId,startDate,endDate]
     await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}

const assignRoom = async (userId,roomId,familyId,vacationId) => {

  try {
    const sql = userRoomQuery.assignRoom(vacationId)
     const parameters = [userId,roomId,familyId]
    await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}

const updateAssignRoom = async (userId,roomId,vacationId) => {
  try {
    let sql  = userRoomQuery.updateAssignRoom(vacationId)
    const parameters = [roomId,userId]
    await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}
const updateStartEndAndDate = async (vacationId,familyId,startDate,endDate) => {
  try {
    let sql  = userRoomQuery.updateStartEndAndDate(vacationId)
    const parameters = [startDate,endDate,familyId]
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

const removeMainRoom = async (familyId,vacationId) => {
  try {
    const sql = userRoomQuery.removeMainRoom(vacationId)
    const parameters = [familyId]
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


const getChosenRoom = async (userId,vacationId) => {

  try {
    let sql = userRoomQuery.getChosenRoom(vacationId)
     const parameters = [userId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}

const getUsersChosenRoom = async (familyId,vacationId) => {
  try {
    let sql = userRoomQuery.getUsersChosenRoom(vacationId)
    const parameters = [familyId]
    const response = await connection.executeWithParameters(sql,parameters)
     return response
 } catch (error) { 
   console.log(error)
 }
}

const removeUserAssignMainRoom = async (userId,vacationId) => {
  try {
     let sql = userRoomQuery.removeUserAssignMainRoom(vacationId)
     const parameters = [userId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}

const removeAllUserAssignRoom = async (familyId,vacationId) => {
  try {
     let sql = userRoomQuery.removeAllUserAssignRoom(vacationId)
     const parameters = [familyId]
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
  assignRoom,
  getChosenRoom,
  updateAssignRoom,
  removeUserAssignMainRoom,
  removeAllUserAssignRoom,
  getUsersChosenRoom,
  getUsersChosenRoom,
  updateStartEndAndDate

}