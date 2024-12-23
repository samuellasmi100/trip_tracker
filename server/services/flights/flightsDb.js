const connection = require("../../db/connection-wrapper");
const flightsQuery = require("../../sql/query/fligthsQuery")
const logger = require("../../utils/logger");


const addFlightsDetails = async (flightsData,vacationId) => {
  delete flightsData.type
  delete flightsData.all_flight_data_null
  try {
    const sql = flightsQuery.addFlightsDetails(flightsData,vacationId)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)

  } catch (error) {
    logger.error(
      `Error: Function:addFlightsDetails :, ${error.sqlMessage}`,
    );
  }
}

const updateFlightsDetails = async (flightsData,vacationId) => {
  console.log(flightsData)
 const userId = flightsData.user_id
 delete flightsData.type
 delete flightsData.arrival_date
 delete flightsData.departure_date
 delete flightsData.all_flight_data_null
  try {
    const sql = flightsQuery.updateFlightsDetails(flightsData,userId,vacationId)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(
      `Error: Function:updateFlightsDetails :, ${error.sqlMessage}`,
    );
  }
}



const getFlightsDetails = async (id,vacationId) => {
  try {
    const sql = flightsQuery.getFlightsDetails(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
   
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getFlightsDetails :, ${error.sqlMessage}`,
    );
  }
}

const getFlightsByFamily = async (id,vacationId) => {

  try {
    const sql = flightsQuery.getFlightsByFamily(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getFlightsByFamily :, ${error.sqlMessage}`,
    );
  }
}

module.exports = {
  addFlightsDetails,
  updateFlightsDetails,
  getFlightsDetails,
  getFlightsByFamily

}