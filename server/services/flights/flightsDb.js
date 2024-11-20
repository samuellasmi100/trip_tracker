const connection = require("../../db/connection-wrapper");
const flightsQuery = require("../../sql/query/fligthsQuery")



const addParentFlightsDetails = async (paymentsData) => {
  try {
    const sql = flightsQuery.addParentFlightsDetails()
    const parameters = [
      paymentsData.parent_id,
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
    const sql = flightsQuery.updateParentFlightsDetails()
    const parameters = [
      paymentsData.validityPassport,
      paymentsData.passportNumber,
      paymentsData.birthDate,
      paymentsData.outboundFlightDate,
      paymentsData.returnFlightDate,
      paymentsData.flightNumber,
      paymentsData.age,
      paymentsData.parent_id,

    ]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    console.log(error)
  }
}

const addChildFlightsDetails = async (paymentsData) => {
  try {
    const sql = flightsQuery.addChildFlightsDetails()
    const parameters = [
      paymentsData.child_id,
      paymentsData.parent_id,
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

const updateChildrenFlightsDetails = async (paymentsData) => {
  console.log(paymentsData,'paymentsData')
  try {
    const sql = flightsQuery.updateChildrenFlightsDetails()
    const parameters = [
      paymentsData.parentId,
      paymentsData.validityPassport,
      paymentsData.passportNumber,
      paymentsData.birthDate,
      paymentsData.outboundFlightDate,
      paymentsData.returnFlightDate,
      paymentsData.flightNumber,
      paymentsData.age,
      paymentsData.childId
    ]
    console.log(parameters,'parameters')
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    console.log(error)
  }
}

const getParentDetails = async (id) => {
  try {
    const sql = flightsQuery.getParentDetails()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    console.log(error)
  }
}

const getChildDetails = async (id) => {
  try {
    const sql = flightsQuery.getChildDetails()
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
  getChildDetails,
  updateChildrenFlightsDetails
}