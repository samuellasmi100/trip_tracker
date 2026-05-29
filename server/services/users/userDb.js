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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
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
    throw error;
  }
}
// Transaction-aware variants. The first parameter is the tx object yielded
// by connection.withTransaction. Used by userService when is_main_user=1 is
// being set, so the "clear other main users" UPDATE and the insert/update
// commit or roll back together.

const clearOtherMainUsersTx = async (tx, vacationId, familyId, userId) => {
  const sql = userQuery.clearOtherMainUsers(vacationId);
  try {
    return await tx.executeWithParameters(sql, [familyId, userId]);
  } catch (error) {
    logger.error(`Error: Function:clearOtherMainUsersTx :, ${error.sqlMessage}`);
    throw error;
  }
};

const addGuestTx = async (tx, data, vacationId) => {
  // Mirror the non-tx addGuest: strip userType before composing the INSERT
  // (it's a client-side hint, not a DB column).
  const clean = { ...data };
  delete clean.userType;
  const sql = userQuery.addGuest(clean, vacationId);
  const parameters = Object.values(clean);
  try {
    return await tx.executeWithParameters(sql, parameters);
  } catch (error) {
    logger.error(`Error: Function:addGuestTx :, ${error.sqlMessage}`);
    throw error;
  }
};

const updateGuestTx = async (tx, data, vacationId) => {
  // Mirror the non-tx updateGuest: clone, strip the non-column keys (the
  // query builder also strips, but cloning keeps the caller's data intact).
  const clean = { ...data };
  const userId = clean.user_id;
  delete clean.family_name;
  delete clean.userType;
  const sql = userQuery.updateGuest(clean, userId, vacationId);
  const parameters = Object.values(clean);
  try {
    return await tx.executeWithParameters(sql, parameters);
  } catch (error) {
    logger.error(`Error: Function:updateGuestTx :, ${error.sqlMessage}`);
    throw error;
  }
};

module.exports = {
  addGuest,
  addGuestTx,
  clearOtherMainUsersTx,
  getFamilyGuests,
  updateGuest,
  updateGuestTx,
  getFamilyMember,
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