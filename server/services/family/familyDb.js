const connection = require("../../db/connection-wrapper");
const familyQuery = require("../../sql/query/familyQuery")


const addFamily = async (data) => {
  try {
    const sql = familyQuery.addFamily()
    const parameters = [data.familyName,data.familyId]

    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}


const getFamilies = async () => {
  try {
    const sql = familyQuery.getFamilies()
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