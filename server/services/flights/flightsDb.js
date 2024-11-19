const connection = require("../../db/connection-wrapper");
const fligthsQuery = require("../../sql/query/fligthsQuery")



const addParentFlightsDetails = async (paymentsData) => {
  try {
    const sql = fligthsQuery.addParentFlightsDetails()
    const parameters = [
      paymentsData.parentId,
      paymentsData.validityPassport,
      paymentsData.passportNumber,
      paymentsData.birthDate,
      paymentsData.outboundFlightDate,
      paymentsData.returnFlightDate,
      paymentsData.flightNumber,
      paymentsData.age,
    ]

    await connection.executeWithParameters(sql, parameters)


  } catch (error) {
    console.log(error)
  }
}
const updateParentFlightsDetails = async (paymentsData) => {
  try {
    const sql = fligthsQuery.updateParentFlightsDetails()
    const parameters = [
      paymentsData.validityPassport,
      paymentsData.passportNumber,
      paymentsData.birthDate,
      paymentsData.outboundFlightDate,
      paymentsData.returnFlightDate,
      paymentsData.flightNumber,
      paymentsData.age,
      paymentsData.parentId,

    ]

    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    console.log(error)
  }
}
const addChildFlightsDetails = async (paymentsData) => {
  try {
    const sql = fligthsQuery.addChildFlightsDetails()
    const parameters = [
      paymentsData.childId,
      paymentsData.parentId,
      paymentsData.validityPassport,
      paymentsData.passportNumber,
      paymentsData.birthDate,
      paymentsData.outboundFlightDate,
      paymentsData.returnFlightDate,
      paymentsData.flightNumber,
      paymentsData.age,
    ]
    await connection.executeWithParameters(sql, parameters)


  } catch (error) {
    console.log(error)
  }
}
const getParentDetails = async (id) => {
  try {
    const sql = fligthsQuery.getParentDetails()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    console.log(error)
  }
}
const getChildDetails = async (id) => {
  try {
    const sql = fligthsQuery.getChildDetails()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    console.log(error)
  }
}


module.exports = {
  addParentFlightsDetails,
  addChildFlightsDetails,
  updateParentFlightsDetails,
  getParentDetails,
  getChildDetails
}