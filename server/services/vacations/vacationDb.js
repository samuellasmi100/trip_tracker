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

const getVacationPartById = async (id) => {
  try {
    const sql = vacationQuery.getVacationPartById()
    const response = await connection.executeWithParameters(sql, [id])
    return response
  } catch (error) {
    logger.error(`Error: Function:getVacationPartById :, ${error.sqlMessage}`);
    // Rethrow: the delete decision depends on this read. A swallowed error must
    // never be mistaken for "no part / no blockers" and let an unsafe delete through.
    throw error;
  }
}

const getGuestsOnPart = async (vacationId, name) => {
  const sanitizedVacationId = vacationId.replace(/[^a-zA-Z0-9_]/g, '_');
  try {
    const sql = vacationQuery.getGuestsOnPart(sanitizedVacationId)
    const response = await connection.executeWithParameters(sql, [name])
    return response
  } catch (error) {
    logger.error(`Error: Function:getGuestsOnPart :, ${error.sqlMessage}`);
    throw error;
  }
}

const getFamiliesOnPartDates = async (vacationId, startDate, endDate) => {
  const sanitizedVacationId = vacationId.replace(/[^a-zA-Z0-9_]/g, '_');
  try {
    const sql = vacationQuery.getFamiliesOnPartDates(sanitizedVacationId)
    const response = await connection.executeWithParameters(sql, [startDate, endDate])
    return response
  } catch (error) {
    logger.error(`Error: Function:getFamiliesOnPartDates :, ${error.sqlMessage}`);
    throw error;
  }
}

const deleteVacationPart = async (id) => {
  try {
    const sql = vacationQuery.deleteVacationPart()
    const response = await connection.executeWithParameters(sql, [id])
    return response
  } catch (error) {
    logger.error(`Error: Function:deleteVacationPart :, ${error.sqlMessage}`);
    throw error;
  }
}

const updateVacation = async (vacationId, name) => {
  try {
    const sql = vacationQuery.updateVacation()
    const response = await connection.executeWithParameters(sql, [name, vacationId])
    return response
  } catch (error) {
    logger.error(`Error: Function:updateVacation :, ${error.sqlMessage}`);
    throw error;
  }
}

const updateVacationDate = async (id, startDate, endDate) => {
  try {
    const sql = vacationQuery.updateVacationDate()
    const response = await connection.executeWithParameters(sql, [startDate, endDate, id])
    return response
  } catch (error) {
    logger.error(`Error: Function:updateVacationDate :, ${error.sqlMessage}`);
    throw error;
  }
}

const getGuestsForResync = async (vacationId) => {
  const sanitizedVacationId = vacationId.replace(/[^a-zA-Z0-9_]/g, '_');
  try {
    const sql = vacationQuery.getGuestsForResync(sanitizedVacationId)
    return await connection.execute(sql)
  } catch (error) {
    logger.error(`Error: Function:getGuestsForResync :, ${error.sqlMessage}`);
    throw error;
  }
}

const getFamiliesForResync = async (vacationId) => {
  const sanitizedVacationId = vacationId.replace(/[^a-zA-Z0-9_]/g, '_');
  try {
    const sql = vacationQuery.getFamiliesForResync(sanitizedVacationId)
    return await connection.execute(sql)
  } catch (error) {
    logger.error(`Error: Function:getFamiliesForResync :, ${error.sqlMessage}`);
    throw error;
  }
}

// Apply every guest week_chosen correction as one all-or-nothing unit: a failure
// partway through rolls back the prior writes, so the re-sync can never leave a
// tenant half-synced. No-op (and no transaction) when there is nothing to write.
const applyGuestWeekChosen = async (vacationId, updates) => {
  if (!updates || updates.length === 0) return
  const sanitizedVacationId = vacationId.replace(/[^a-zA-Z0-9_]/g, '_');
  const sql = vacationQuery.updateGuestWeekChosen(sanitizedVacationId)
  try {
    await connection.withTransaction(async (tx) => {
      for (const u of updates) {
        await tx.executeWithParameters(sql, [u.week_chosen, u.id])
      }
    })
  } catch (error) {
    logger.error(`Error: Function:applyGuestWeekChosen :, ${error.sqlMessage || error.message}`);
    throw error;
  }
}


module.exports = {
    addVacation,
    getVacations,
    addVacationDates,
    getVacationDates,
    getAllVacationDates,
    getVacationPartById,
    getGuestsOnPart,
    getFamiliesOnPartDates,
    deleteVacationPart,
    updateVacation,
    updateVacationDate,
    getGuestsForResync,
    getFamiliesForResync,
    applyGuestWeekChosen
}