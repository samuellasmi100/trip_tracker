const connection = require("../../db/connection-wrapper");
const flightsQuery = require("../../sql/query/fligthsQuery")



const addParentFlightsDetails = async (flightsData) => {
  try {
    const sql = flightsQuery.addParentFlightsDetails(flightsData)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)


  } catch (error) {
    console.log(error)
  }
}

const updateParentFlightsDetails = async (flightsData) => {
 const parentId = flightsData.parent_id
 delete flightsData.parent_id
 delete flightsData.type
 delete flightsData.parentId
  try {
    const sql = flightsQuery.updateParentFlightsDetails(flightsData,parentId)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    console.log(error)
  }
}

const addChildFlightsDetails = async (flightsData) => {
  try {
    const sql = flightsQuery.addChildFlightsDetails(flightsData)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)


  } catch (error) {
    console.log(error)
  }
}

const updateChildrenFlightsDetails = async (flightsData) => {
  const childId = flightsData.child_id
  delete flightsData.child_id
  delete flightsData.type
  delete flightsData.childId
  try {
    const sql = flightsQuery.updateChildrenFlightsDetails(flightsData,childId)
    const parameters = Object.values(flightsData)
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