const connection = require("../../db/connection-wrapper");
const familyQuery = require("../../sql/query/familyQuery")


const addFamily = async (data,vacationId) => {
  try {
    const sql = familyQuery.addFamily(vacationId)
    const parameters = [data.familyName,data.familyId]

    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}


const getFamilies = async (vacationId) => {
  try {
    const sql = familyQuery.getFamilies(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) { 
    console.log(error)
  }
}




module.exports = {
    addFamily,
    getFamilies,
    
}