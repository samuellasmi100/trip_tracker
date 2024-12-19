const connection = require("../../db/connection-wrapper");
const vacationQuery = require("../../sql/query/vacationQuery")
const createDatabaseAndTable = require("../../sql/utils/createDb")

const addVacation = async (vacationDetails,vacationId) => {
  const sanitizedVacationId = vacationId.replace(/[^a-zA-Z0-9_]/g, '_');

  try {
    const sqlAddName = vacationQuery.addVacation()
    const sqlAddNameParameters = [vacationDetails.vacation_name,sanitizedVacationId]

    await connection.executeWithParameters(sqlAddName,sqlAddNameParameters)
     await createDatabaseAndTable(sanitizedVacationId)
    
  } catch (error) { 
  logger.error(
      `Error: Function:addVacation :, ${error.sqlMessage}`,
    );
  }
}

const addVacationDates = async (vacationId,startData,endDate,name) => {
  const sanitizedVacationId = vacationId.replace(/[^a-zA-Z0-9_]/g, '_');
  try {
    const sql = vacationQuery.addVacationDates()
    let parameters = [sanitizedVacationId,startData,endDate,name]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) {
  logger.error(
      `Error: Function:addVacationDates :, ${error.sqlMessage}`,
    );
  }
}

const getVacations = async () => {
    try {
      const sql = vacationQuery.getVacations()
      const response = await connection.execute(sql)
      return response
    } catch (error) { 
    logger.error(
      `Error: Function:getVacations :, ${error.sqlMessage}`,
    );
    }
}

const getVacationDates = async (vacationId) => {
  try {
    const sql = vacationQuery.getVacationDates()
    const parameters = [vacationId]
    const response = await connection.executeWithParameters(sql,parameters)
    return response
  } catch (error) { 
  logger.error(
      `Error: Function:getVacationDates :, ${error.sqlMessage}`,
    );
  }
}
const getAllVacationDates = async () => {
  try {
    const sql = vacationQuery.getAllVacationDates()
    const response = await connection.execute(sql)
    return response
  } catch (error) { 
  logger.error(
      `Error: Function:getAllVacationDates :, ${error.sqlMessage}`,
    );
  }
}


module.exports = {
    addVacation,
    getVacations,
    addVacationDates,
    getVacationDates,
    getAllVacationDates
}