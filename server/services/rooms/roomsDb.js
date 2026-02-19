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
const getRoomDetailsWithCounts = async (vacationId) => {
  try {
    const sql = roomsQuery.getRoomDetailsWithCounts(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getRoomDetailsWithCounts :, ${error.sqlMessage}`,
    );
  }
}
const updateRoom = async (data, vacationId) => {
  try {
    const roomsId = data.rooms_id;
    // Only keep whitelisted columns — prevents dynamic column injection
    const filteredData = {};
    for (const key of roomsQuery.ALLOWED_ROOM_COLUMNS) {
      if (data[key] !== undefined) filteredData[key] = data[key];
    }
    const sql = roomsQuery.updateRoom(filteredData, roomsId, vacationId)
    const parameters = [...Object.values(filteredData), roomsId]
    const response = await connection.executeWithParameters(sql, parameters)
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

const getUnAvailableDates = async (vacationId, roomId) => {
  try {
    const sql = roomsQuery.getUnAvailableDates(vacationId, roomId)
    const response = roomId
      ? await connection.executeWithParameters(sql, [roomId])
      : await connection.execute(sql)
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