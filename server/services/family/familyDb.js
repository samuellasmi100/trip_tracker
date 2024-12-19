const connection = require("../../db/connection-wrapper");
const familyQuery = require("../../sql/query/familyQuery")
const logger = require("../../utils/logger");

const addFamily = async (data,vacationId) => {
  try {
    const sql = familyQuery.addFamily(vacationId)
    const parameters = [data.familyName,data.familyId]

    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    logger.error(
      `Error: Function:addFamily :, ${error.sqlMessage}`,
    );
  }
}


const getFamilies = async (vacationId) => {
  try {
    const sql = familyQuery.getFamilies(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) { 
    logger.error(
      `Error: Function:getFamilies :, ${error.sqlMessage}`,
    );
  }
}




module.exports = {
    addFamily,
    getFamilies,
    
}