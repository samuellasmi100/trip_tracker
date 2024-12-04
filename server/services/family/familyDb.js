const connection = require("../../db/connection-wrapper");
const familyQuery = require("../../sql/query/familyQuery")


const addFamily = async (data,vacationId) => {
  try {
    const sql = familyQuery.addFamily()
    const parameters = [data.familyName,data.familyId]

    await connection.executeWithParameters(sql,parameters,vacationId)
  } catch (error) { 
    console.log(error)
  }
}


const getFamilies = async (vacationId) => {
  try {
    const sql = familyQuery.getFamilies()
    const response = await connection.execute(sql,vacationId)
    return response
  } catch (error) { 
    console.log(error)
  }
}




module.exports = {
    addFamily,
    getFamilies,
    
}