const connection = require("../../db/connection-wrapper");
const familyImportQuery = require("../../sql/query/familyImportQuery");
const logger = require("../../utils/logger");

const getExistingFamilies = async (vacationId) => {
  try {
    return await connection.execute(familyImportQuery.getExistingFamilies(vacationId));
  } catch (error) {
    logger.error(`Error: Function:getExistingFamilies :, ${error.sqlMessage}`);
    throw error;
  }
};

const getValidRoomIds = async (vacationId) => {
  try {
    return await connection.execute(familyImportQuery.getValidRoomIds(vacationId));
  } catch (error) {
    logger.error(`Error: Function:getValidRoomIds :, ${error.sqlMessage}`);
    throw error;
  }
};

module.exports = {
  getExistingFamilies,
  getValidRoomIds,
};
