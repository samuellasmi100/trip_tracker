const connection = require("../../db/connection-wrapper");
const staticQuery = require("../../sql/query/staticQuery")
const ErrorType = require("../../serverLogs/errorType");
const ErrorMessage = require("../../serverLogs/errorMessage");



const getMainGuests = async (vacationId) => {

  try {
    const sql = staticQuery.getMainGuests(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) { 
    console.log(error)
  }
}
const getAllGuests = async (vacationId) => {

    try {
      const sql = staticQuery.getAllGuests(vacationId)
      const response = await connection.execute(sql)
      return response
    } catch (error) { 
      console.log(error)
    }
  }

const getFlightsDetails = async (vacationId) => {

    try {
      const sql = staticQuery.getFlightsDetails(vacationId)
      const response = await connection.execute(sql)
      return response
    } catch (error) { 
      console.log(error)
    }
  }
  const getVacationDetails = async (vacationId) => {
    try {
      const sql = staticQuery.getVacationDetails(vacationId)
      const response = await connection.execute(sql)
      return response
    } catch (error) { 
      console.log(error)
    }
  }

module.exports = {
    getMainGuests,
    getAllGuests,
    getFlightsDetails,
    getVacationDetails
}