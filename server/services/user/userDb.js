const connection = require("../../db/connection-wrapper");
const userQuery = require("../../sql/query/userQuery")
const ErrorType = require("../../serverLogs/errorType");
const ErrorMessage = require("../../serverLogs/errorMessage");

const addGuest = async (data, vacationId) => {
  delete data.userType
  const sql = userQuery.addGuest(data, vacationId)
  const parameters = Object.values(data)
  try {
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    throw new ErrorMessage(ErrorType.SQL_GENERAL_ERROR,
      { sql: sql, parameters: parameters, time: new Date() },
      error
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
    console.log(error)
  }
}

const getFamilyMember = async (id, vacationId) => {

  try {
    const sql = userQuery.getFamilyMember(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    console.log(error)
  }
}


const updateGuest = async (data, vacationId) => {
  console.log(data)
  try {
    const userId = data.user_id
    delete data.family_name
    delete data.userType
    const sql = userQuery.updateGuest(data, userId, vacationId)
    const parameters = Object.values(data)
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    throw new ErrorMessage(error.errorType, sql, error);
  }
}

const deleteGuest = async (userId, vacationId) => {
  const sql = userQuery.deleteGuest(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
  }
}

const deleteGuestFlights = async (userId, vacationId) => {
  const sql = userQuery.deleteGuestFlights(vacationId)

  try {

    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
  }
}

const deleteGuestRooms = async (userId, vacationId) => {
  const sql = userQuery.deleteGuestRooms(vacationId)

  try {

    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
  }
}

const deleteNotes = async (userId, vacationId) => {
  const sql = userQuery.deleteNotes(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
  }
}

const saveRegistrationForm = async (filename, fileType, filePath, id) => {
  try {

    const sql = userQuery.saveRegistrationForm()
    const parameters = [filename, fileType, filePath, id]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
  }
}

const deleteFamilyGuests = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyGuests(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
  }
}
const deleteFamilyFlights = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyFlights(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
  }
}
const deleteFamilyRooms = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyRooms(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
  }
}
const deleteFamilyGuestRooms = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyGuestRooms(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
  }
}
const deleteFamilyNotes = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyNotes(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
  }
}
const deleteFamilyPayments = async (userId, vacationId) => {
  const sql = userQuery.deleteFamilyPayments(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
  }
}
const deleteFamily = async (userId, vacationId) => {
  const sql = userQuery.deleteFamily(vacationId)

  try {
    const parameters = [userId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response

  } catch (error) {
    console.log(error)
    // throw new ErrorMessage(error.errorType,sql, error);
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