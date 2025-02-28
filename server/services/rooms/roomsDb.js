const connection = require("../../db/connection-wrapper");
const roomsQuery = require("../../sql/query/roomsQuery")
const logger = require("../../utils/logger");

const getAll = async (vacationId) => {
    try {
      const sql = roomsQuery.getAll(vacationId)
      const response = await connection.execute(sql)
      return response
     
    } catch (error) { 
      logger.error(
        `Error: Function:getAll :, ${error.sqlMessage}`,
      );
    }
}
const getRoomDetailsWithCounts = async () => {
  try {
    const sql = roomsQuery.getRoomDetailsWithCounts()
    const response = await connection.execute(sql)
    return response
   
  } catch (error) { 
    logger.error(
      `Error: Function:getRoomDetailsWithCounts :, ${error.sqlMessage}`,
    );
  }
}
const updateRoom = async (data,vacationId) => {
  try {
    const roomsId = data.rooms_id
    delete data.number_of_people
    delete data.id
    delete data.family_id
    delete data.family_name
    delete data.people_count
    const sql = roomsQuery.updateRoom(data,roomsId,vacationId)
    const parameters = Object.values(data)
    const response = await connection.executeWithParameters(sql,parameters)
    return response
   
  } catch (error) { 
    logger.error(
      `Error: Function:updateRoom :, ${error.sqlMessage}`,
    );
  }
}

const getRoomAvailable = async (vacationId,startData,endDate) => {
  try {
     let sql = roomsQuery.getRoomAvailable(vacationId)
     const parameters = [startData,endDate]
     const response = await connection.executeWithParameters(sql,parameters)
    return response

  } catch (error) { 
    logger.error(
      `Error: Function:getRoomAvailable :, ${error.sqlMessage}`,
    );
  }
}

const getUnAvailableDates = async (vacationId,roomId) => {
 
  try {
     let sql = roomsQuery.getUnAvailableDates(vacationId)
    
     const response = await connection.execute(sql)
     
    return response

  } catch (error) { 
    logger.error(
      `Error: Function:getUnAvailableDates :, ${error.sqlMessage}`,
    );
  }
}
module.exports = {
  getAll,
  updateRoom,
  getRoomDetailsWithCounts,
  getRoomAvailable,
  getUnAvailableDates
}