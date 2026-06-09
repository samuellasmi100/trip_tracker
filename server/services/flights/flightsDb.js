const connection = require("../../db/connection-wrapper");
const flightsQuery = require("../../sql/query/flightsQuery")
const logger = require("../../utils/logger");


const addFlightsDetails = async (flightsData,vacationId) => {
  delete flightsData.type
  delete flightsData.all_flight_data_null
  try {
    const sql = flightsQuery.addFlightsDetails(flightsData,vacationId)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)

  } catch (error) {
    logger.error(
      `Error: Function:addFlightsDetails :, ${error.sqlMessage}`,
    );
    throw error;
  }
}

const updateFlightsDetails = async (flightsData,vacationId) => {
 const userId = flightsData.user_id
 delete flightsData.type
 delete flightsData.arrival_date
 delete flightsData.departure_date
 delete flightsData.all_flight_data_null
  try {
    const sql = flightsQuery.updateFlightsDetails(flightsData,userId,vacationId)
    const parameters = Object.values(flightsData)
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(
      `Error: Function:updateFlightsDetails :, ${error.sqlMessage}`,
    );
    throw error;
  }
}



const getFlightsDetails = async (id,vacationId) => {
  try {
    const sql = flightsQuery.getFlightsDetails(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
   
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getFlightsDetails :, ${error.sqlMessage}`,
    );
  }
}

const getFlightsByFamily = async (id,vacationId) => {

  try {
    const sql = flightsQuery.getFlightsByFamily(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getFlightsByFamily :, ${error.sqlMessage}`,
    );
  }
}

const getFamilyFlightsWithNames = async (familyId, vacationId) => {
  try {
    const sql = flightsQuery.getFamilyFlightsWithNames(vacationId);
    return await connection.executeWithParameters(sql, [familyId]);
  } catch (error) {
    logger.error(`Error: Function:getFamilyFlightsWithNames: ${error.sqlMessage}`);
  }
}

// ── Transaction-aware variants for the group-flights bulk apply ──────────────
// First arg is the tx connection from connection.withTransaction (same shape as
// the pool helper). Kept separate from the non-tx fns above so the bulk apply
// commits/rolls back atomically.

const getLatestFlightsByUserIdsTx = async (tx, userIds, vacationId) => {
  try {
    const sql = flightsQuery.getLatestFlightsByUserIds(userIds, vacationId)
    return await tx.executeWithParameters(sql, [...userIds])
  } catch (error) {
    logger.error(`Error: Function:getLatestFlightsByUserIdsTx :, ${error.sqlMessage}`)
    throw error
  }
}

const updateFlightLegsTx = async (tx, legData, userId, vacationId) => {
  try {
    const sql = flightsQuery.updateFlightLegs(legData, vacationId)
    return await tx.executeWithParameters(sql, [...Object.values(legData), userId])
  } catch (error) {
    logger.error(`Error: Function:updateFlightLegsTx :, ${error.sqlMessage}`)
    throw error
  }
}

const insertFlightRowTx = async (tx, rowData, vacationId) => {
  try {
    // Reuse the existing dynamic INSERT builder (INSERT (keys) VALUES (?,…)).
    const sql = flightsQuery.addFlightsDetails(rowData, vacationId)
    return await tx.executeWithParameters(sql, Object.values(rowData))
  } catch (error) {
    logger.error(`Error: Function:insertFlightRowTx :, ${error.sqlMessage}`)
    throw error
  }
}

const setGuestFlyingFlagTx = async (tx, userId, direction, vacationId) => {
  try {
    const sql = flightsQuery.setGuestFlyingFlag(vacationId)
    return await tx.executeWithParameters(sql, [direction, userId])
  } catch (error) {
    logger.error(`Error: Function:setGuestFlyingFlagTx :, ${error.sqlMessage}`)
    throw error
  }
}

const setGuestNotFlyingTx = async (tx, userId, vacationId) => {
  try {
    const sql = flightsQuery.setGuestNotFlying(vacationId)
    return await tx.executeWithParameters(sql, [userId])
  } catch (error) {
    logger.error(`Error: Function:setGuestNotFlyingTx :, ${error.sqlMessage}`)
    throw error
  }
}

module.exports = {
  addFlightsDetails,
  updateFlightsDetails,
  getFlightsDetails,
  getFlightsByFamily,
  getFamilyFlightsWithNames,
  getLatestFlightsByUserIdsTx,
  updateFlightLegsTx,
  insertFlightRowTx,
  setGuestFlyingFlagTx,
  setGuestNotFlyingTx,
}