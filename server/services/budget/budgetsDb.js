
const connection = require("../../db/connection-wrapper");
const budgetQuery = require("../../sql/query/budgetQuery")
const logger = require("../../utils/logger");

const getCategory = async (vacationId) => {
  try {
    const sql = budgetQuery.getCategory(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) { 
    logger.error(
      `Error: Function:getCategory :, ${error.sqlMessage}`,
    );
  }
}


const getSubCategory = async (vacationId,categoryId) => {
  try {
    const sql = budgetQuery.getSubCategory(vacationId)
    const parameters = [categoryId]
    const response = await connection.executeWithParameters(sql,parameters)
    return response
  } catch (error) { 
    logger.error(
      `Error: Function:getSubCategory :, ${error.sqlMessage}`,
    );
  }
}



module.exports = {
    getCategory,
    getSubCategory
}