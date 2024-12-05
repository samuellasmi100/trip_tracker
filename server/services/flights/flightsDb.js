const connection = require("../../db/connection-wrapper");
const flightsQuery = require("../../sql/query/fligthsQuery")



const addFlightsDetails = async (flightsData,vacationId) => {
  try {
    const sql = flightsQuery.addFlightsDetails(flightsData,vacationId)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)

  } catch (error) {
    console.log(error)
  }
}

const updateFlightsDetails = async (flightsData,vacationId) => {
 const userId = flightsData.user_id
 delete flightsData.type
  try {
    const sql = flightsQuery.updateFlightsDetails(flightsData,userId,vacationId)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    console.log(error)
  }
}



const getFlightsDetails = async (id,vacationId) => {
  try {
    const sql = flightsQuery.getFlightsDetails(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    console.log(error)
  }
}

const getFlightsByFamily = async (id,vacationId) => {
  try {
    const sql = flightsQuery.getFlightsByFamily(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  addFlightsDetails,
  updateFlightsDetails,
  getFlightsDetails,
  getFlightsByFamily

}