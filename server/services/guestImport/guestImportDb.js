const connection = require("../../db/connection-wrapper");
const guestImportQuery = require("../../sql/query/guestImportQuery");
const logger = require("../../utils/logger");

const getExistingGroups = async (vacationId) => {
  try {
    return await connection.execute(guestImportQuery.getExistingGroups(vacationId));
  } catch (error) {
    logger.error(`Error: Function:getExistingGroups :, ${error.sqlMessage}`);
    throw error;
  }
};

const getGroupGuests = async (vacationId, familyId) => {
  try {
    return await connection.executeWithParameters(
      guestImportQuery.getGroupGuests(vacationId),
      [familyId]
    );
  } catch (error) {
    logger.error(`Error: Function:getGroupGuests :, ${error.sqlMessage}`);
    throw error;
  }
};

// fields: { column: value } — only DB-empty columns the caller chose to fill.
const fillEmptyGuestFields = async (vacationId, userId, fields) => {
  const columns = Object.keys(fields);
  if (columns.length === 0) return;
  try {
    const sql = guestImportQuery.fillEmptyGuestFields(vacationId, columns);
    await connection.executeWithParameters(sql, [...columns.map((c) => fields[c]), userId]);
  } catch (error) {
    logger.error(`Error: Function:fillEmptyGuestFields :, ${error.sqlMessage}`);
    throw error;
  }
};

module.exports = {
  getExistingGroups,
  getGroupGuests,
  fillEmptyGuestFields,
};
