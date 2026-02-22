const connection = require("../../db/connection-wrapper");
const familyQuery = require("../../sql/query/familyQuery")
const logger = require("../../utils/logger");

const addFamily = async (data,vacationId) => {
  try {
    const sql = familyQuery.addFamily(vacationId)
    const parameters = [
      data.familyName,
      data.familyId,
      data.number_of_guests || null,
      data.number_of_rooms || null,
      data.total_amount || null,
      data.start_date || null,
      data.end_date || null,
    ]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:addFamily :, ${error.sqlMessage}`);
  }
}

const getFamilies = async (vacationId, { page = 1, search = '' } = {}) => {
  try {
    const limit = familyQuery.PAGE_SIZE;
    const offset = (page - 1) * limit;
    // LIMIT/OFFSET embedded in SQL; only search term is a bound parameter
    const sql = familyQuery.getFamilies(vacationId, { search, limit, offset });
    if (search) {
      return await connection.executeWithParameters(sql, [`%${search}%`]);
    }
    return await connection.execute(sql);
  } catch (error) {
    logger.error(`Error: Function:getFamilies :, ${error.sqlMessage}`);
    return [];
  }
}

const countFamilies = async (vacationId, { search = '' } = {}) => {
  try {
    const sql = familyQuery.countFamilies(vacationId, { search });
    let response;
    if (search) {
      response = await connection.executeWithParameters(sql, [`%${search}%`]);
    } else {
      response = await connection.execute(sql);
    }
    return Number(response[0].total);
  } catch (error) {
    logger.error(`Error: Function:countFamilies :, ${error.sqlMessage}`);
    return 0;
  }
}

const getStats = async (vacationId) => {
  try {
    const sql = familyQuery.getStats(vacationId);
    const response = await connection.execute(sql);
    return response[0];
  } catch (error) {
    logger.error(`Error: Function:getStats :, ${error.sqlMessage}`);
    return { family_count: 0, total_guests: 0, total_missing: 0, total_balance: 0 };
  }
}

const updateFamily = async (data, vacationId) => {
  try {
    const sql = familyQuery.updateFamily(vacationId)
    await connection.executeWithParameters(sql, [
      data.family_name,
      data.number_of_guests,
      data.number_of_rooms,
      data.total_amount,
      data.start_date || null,
      data.end_date || null,
      data.family_id,
    ])
  } catch (error) {
    logger.error(`Error: Function:updateFamily :, ${error.sqlMessage}`)
  }
}

const searchFamilies = async (vacationId, searchTerm) => {
  try {
    const sql = familyQuery.searchFamilies(vacationId);
    const response = await connection.executeWithParameters(sql, [`%${searchTerm}%`]);
    return response;
  } catch (error) {
    logger.error(`Error: Function:searchFamilies: ${error.sqlMessage}`);
    throw error;
  }
};

module.exports = {
  addFamily,
  getFamilies,
  countFamilies,
  getStats,
  updateFamily,
  searchFamilies,
}
