const connection = require("../../db/connection-wrapper");
const userQuery = require("../../sql/query/userQuery")
const logger = require("../../utils/logger");

const addGuest = async (data, vacationId) => {
  delete data.userType
  const sql = userQuery.addGuest(data, vacationId)
  const parameters = Object.values(data)
  try {
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(
      `Error: Function:addGuest :, ${error.sqlMessage}`,
    );
  }
}

const getFamilyGuests = async (id, vacationId) => {
  try {
    const sql = userQuery.getFamilyGuests(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getFamilyGuests :, ${error.sqlMessage}`,
    );
  }
}

const getFamilyMember = async (id, vacationId) => {

  try {
    const sql = userQuery.getFamilyMember(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getFamilyMember :, ${error.sqlMessage}`,
    );
  }
}

const updateGuest = async (data, vacationId) => {
  try {
    const userId = data.user_id
    delete data.family_name
    delete data.userType
    const sql = userQuery.updateGuest(data, userId, vacationId)
    const parameters = Object.values(data)
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:updateGuest :, ${error.sqlMessage}`,
    );
  }
}

const deleteGuest = async (userId, vacationId) => {
  const sql = userQuery.deleteGuest(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteGuest :, ${error.sqlMessage}`,
    );
  }
}

const deleteGuestFlights = async (userId, vacationId) => {
  const sql = userQuery.deleteGuestFlights(vacationId)

  try {

    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteGuestFlights :, ${error.sqlMessage}`,
    );
  }
}

const deleteGuestRooms = async (userId, vacationId) => {
  const sql = userQuery.deleteGuestRooms(vacationId)

  try {

    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteGuestRooms :, ${error.sqlMessage}`,
    );
  }
}

const deleteNotes = async (userId, vacationId) => {
  const sql = userQuery.deleteNotes(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteNotes :, ${error.sqlMessage}`,
    );
  }
}

const saveRegistrationForm = async (filename, fileType, filePath, id) => {
  try {

    const sql = userQuery.saveRegistrationForm()
    const parameters = [filename, fileType, filePath, id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:saveRegistrationForm :, ${error.sqlMessage}`,
    );
  }
}

const deleteFamilyGuests = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyGuests(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteFamilyGuests :, ${error.sqlMessage}`,
    );
  }
}
const deleteFamilyFlights = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyFlights(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteFamilyFlights :, ${error.sqlMessage}`,
    );
  }
}
const deleteFamilyRooms = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyRooms(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteFamilyRooms :, ${error.sqlMessage}`,
    );
  }
}
const deleteFamilyGuestRooms = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyGuestRooms(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteFamilyGuestRooms :, ${error.sqlMessage}`,
    );
  }
}
const deleteFamilyNotes = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyNotes(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteFamilyNotes :, ${error.sqlMessage}`,
    );
  }
}
const deleteFamilyPayments = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyPayments(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteFamilyPayments :, ${error.sqlMessage}`,
    );
  }
}
const deleteFamily = async (userId, vacationId) => {
  const sql = userQuery.deleteFamily(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    logger.error(
      `Error: Function:deleteFamily :, ${error.sqlMessage}`,
    );
  }
}
module.exports = {
  addGuest,
  getFamilyGuests,
  updateGuest,
  getFamilyMember,
  saveRegistrationForm,
  deleteGuest,
  deleteGuestFlights,
  deleteGuestRooms,
  deleteNotes,
  deleteFamilyGuests,
  deleteFamilyFlights,
  deleteFamilyRooms,
  deleteFamilyGuestRooms,
  deleteFamilyNotes,
  deleteFamilyPayments,
  deleteFamily,
}