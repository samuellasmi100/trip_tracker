const connection = require("../../db/connection-wrapper");
const flightsQuery = require("../../sql/query/fligthsQuery")



const addFlightsDetails = async (flightsData) => {
  try {
    const sql = flightsQuery.addFlightsDetails(flightsData)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)

  } catch (error) {
    console.log(error)
  }
}

const updateFlightsDetails = async (flightsData) => {
 const userId = flightsData.user_id
 delete flightsData.type
  try {
    const sql = flightsQuery.updateFlightsDetails(flightsData,userId)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    console.log(error)
  }
}



const getFlightsDetails = async (id) => {
  try {
    const sql = flightsQuery.getFlightsDetails()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    console.log(error)
  }
}

const getFlightsByFamily = async (id) => {
  try {
    const sql = flightsQuery.getFlightsByFamily()
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