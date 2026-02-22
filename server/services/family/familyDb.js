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

    await connection.executeWithParameters(sql,parameters)
  } catch (error) {
    logger.error(
      `Error: Function:addFamily :, ${error.sqlMessage}`,
    );
  }
}


const getFamilies = async (vacationId) => {
  try {
    const sql = familyQuery.getFamilies(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) { 
    logger.error(
      `Error: Function:getFamilies :, ${error.sqlMessage}`,
    );
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
    updateFamily,
    searchFamilies,
}