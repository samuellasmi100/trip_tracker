const connection = require("../../db/connection-wrapper");
const staticQuery = require("../../sql/query/staticQuery")
const logger = require("../../utils/logger");

const getMainGuests = async (vacationId, search, limit, offset) => {
  try {
    const sql = staticQuery.getMainGuests(vacationId, limit, offset)
    return await connection.executeWithParameters(sql, [search, search, search, search])
  } catch (error) {
    logger.error(`Error: Function:getMainGuests :, ${error.sqlMessage}`);
  }
}

const getAllGuests = async (vacationId, search, limit, offset) => {
  try {
    const sql = staticQuery.getAllGuests(vacationId, limit, offset)
    return await connection.executeWithParameters(sql, [search, search, search, search])
  } catch (error) {
    logger.error(`Error: Function:getAllGuests :, ${error.sqlMessage}`);
  }
}

const getFlightsDetails = async (vacationId) => {
  try {
    const sql = staticQuery.getFlightsDetails(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(`Error: Function:getFlightsDetails :, ${error.sqlMessage}`);
  }
}

const getVacationDetails = async (vacationId, search, limit, offset) => {
  try {
    const sql = staticQuery.getVacationDetails(vacationId, limit, offset)
    return await connection.executeWithParameters(sql, [search, search, search, search])
  } catch (error) {
    logger.error(`Error: Function:getVacationDetails :, ${error.sqlMessage}`);
  }
}

const getPaymentsDetails = async (vacationId) => {
  try {
    const sql = staticQuery.getPaymentsDetails(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(`Error: Function:getPaymentsDetails :, ${error.sqlMessage}`);
  }
}

module.exports = {
  getMainGuests,
  getAllGuests,
  getFlightsDetails,
  getVacationDetails,
  getPaymentsDetails,
}
