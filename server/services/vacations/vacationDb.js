const connection = require("../../db/connection-wrapper");
const vacationQuery = require("../../sql/query/vacationQuery")
const createDatabaseAndTable = require("../../sql/utils/createDb")
const logger = require("../../utils/logger")

const addVacation = async (vacationDetails,vacationId) => {
  const sanitizedVacationId = vacationId.replace(/[^a-zA-Z0-9_]/g, '_');

  try {
    // Create the per-vacation schema FIRST. createDatabaseAndTable never reads
    // trip_tracker.vacations, so ordering is safe — and if schema creation
    // fails we must NOT insert a vacations row (it would be a phantom vacation
    // pointing at a non-existent schema). No compensating DELETE is needed
    // because the row is never written on failure.
    await createDatabaseAndTable(sanitizedVacationId)

    const sqlAddName = vacationQuery.addVacation()
    const sqlAddNameParameters = [vacationDetails.vacation_name,sanitizedVacationId]
    await connection.executeWithParameters(sqlAddName,sqlAddNameParameters)

  } catch (error) {
    logger.error(
      `Error: Function:addVacation : ${error.sqlMessage || error.message}`,
    );
    // Propagate so vacationService → vacationController return an error
    // response to the client instead of a false success.
    throw error;
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
    throw error;
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