const connection = require("../../db/connection-wrapper");
const userRoomQuery = require("../../sql/query/userRoomQuery")
const logger = require("../../utils/logger");

const assignMainRoom = async (vacationId,familyId,roomId,startDate,endDate) => {
 
  try {
    const sql = userRoomQuery.assignMainRoom(vacationId)
    const parameters = [familyId,roomId,startDate,endDate]
     await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
  logger.error(
      `Error: Function:assignMainRoom :, ${error.sqlMessage}`,
    );
  }
}

const assignRoom = async (userId,roomId,familyId,vacationId) => {

  try {
    const sql = userRoomQuery.assignRoom(vacationId)
     const parameters = [userId,roomId,familyId]
    await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
  logger.error(
      `Error: Function:assignRoom :, ${error.sqlMessage}`,
    );
  }
}

const updateAssignRoom = async (userId,roomId,vacationId) => {
  try {
    let sql  = userRoomQuery.updateAssignRoom(vacationId)
    const parameters = [roomId,userId]
    await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
  logger.error(
      `Error: Function:updateAssignRoom :, ${error.sqlMessage}`,
    );
  }
}
const updateStartEndAndDate = async (vacationId,familyId,startDate,endDate) => {
  try {
    if(startDate !== undefined && endDate !== undefined){
      let sql  = userRoomQuery.updateStartEndAndDate(vacationId)
      const parameters = [startDate,endDate,familyId]
      await connection.executeWithParameters(sql,parameters) 
    }
    
  } catch (error) { 
  logger.error(
      `Error: Function:updateStartEndAndDate :, ${error.sqlMessage}`,
    );
  }
}

const removeMainRoom = async (familyId,vacationId) => {
  try {
    const sql = userRoomQuery.removeMainRoom(vacationId)
    const parameters = [familyId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
  logger.error(
      `Error: Function:removeMainRoom :, ${error.sqlMessage}`,
    );
  }
}

const removeMainRoomByRoomId = async (familyId,vacationId,roomId) => {
  try {
    const sql = userRoomQuery.removeMainRoomByRoomId(vacationId)
    const parameters = [roomId,familyId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
  logger.error(
      `Error: Function:removeMainRoom :, ${error.sqlMessage}`,
    );
  }
}
const getFamilyRoom = async (id,vacationId) => {
  try {
    const sql = userRoomQuery.getFamilyRoom(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
   return response
     
   
  } catch (error) { 
  logger.error(
      `Error: Function:getFamilyRoom :, ${error.sqlMessage}`,
    );
  }
}


const getChosenRoom = async (userId,vacationId) => {

  try {
    let sql = userRoomQuery.getChosenRoom(vacationId)
     const parameters = [userId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
  logger.error(
      `Error: Function:getChosenRoom :, ${error.sqlMessage}`,
    );
  }
}
const getAllChosenRoom = async (vacationId) => {

  try {
    let sql = userRoomQuery.getAllChosenRoom(vacationId)
     const response = await connection.execute(sql)
      return response
  } catch (error) { 
  logger.error(
      `Error: Function:getChosenRoom :, ${error.sqlMessage}`,
    );
  }
}

const getUsersChosenRoom = async (familyId,vacationId) => {
  try {
    let sql = userRoomQuery.getUsersChosenRoom(vacationId)
    const parameters = [familyId]
    const response = await connection.executeWithParameters(sql,parameters)
     return response
 } catch (error) { 
 logger.error(
      `Error: Function:getUsersChosenRoom :, ${error.sqlMessage}`,
    );
 }
}

const removeUserAssignMainRoom = async (userId,vacationId) => {
  try {
     let sql = userRoomQuery.removeUserAssignMainRoom(vacationId)
     const parameters = [userId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
  logger.error(
      `Error: Function:removeUserAssignMainRoom :, ${error.sqlMessage}`,
    );
  }
}

const removeAllUserAssignRoom = async (familyId,vacationId) => {
  try {
     let sql = userRoomQuery.removeAllUserAssignRoom(vacationId)
     const parameters = [familyId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
  logger.error(
      `Error: Function:removeAllUserAssignRoom :, ${error.sqlMessage}`,
    );
  }
}
const removeAllUserAssignFromRoomId = async (familyId,vacationId,roomId) => {
  try {
     let sql = userRoomQuery.removeAllUserAssignFromRoomId(vacationId)
     const parameters = [roomId,familyId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
  logger.error(
      `Error: Function:removeAllUserAssignRoom :, ${error.sqlMessage}`,
    );
  }
}





module.exports = {
  assignMainRoom,
  getFamilyRoom,
  removeMainRoom,
  assignRoom,
  getChosenRoom,
  updateAssignRoom,
  removeUserAssignMainRoom,
  removeAllUserAssignRoom,
  getUsersChosenRoom,
  updateStartEndAndDate,
  removeMainRoomByRoomId,
  removeAllUserAssignFromRoomId,
  getAllChosenRoom
}