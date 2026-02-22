const connection = require("../../db/connection-wrapper");
const notesQuery = require("../../sql/query/notesQuery")
const logger = require("../../utils/logger");


const addNotes = async (noteDetails,vacationId) => {
  try {
    const sql = notesQuery.addNotes(vacationId)
    const parameters = [noteDetails.note,noteDetails.user_id,noteDetails.family_id,noteDetails.categoryName]
     await connection.executeWithParameters(sql,parameters)   
  } catch (error) { 
    logger.error(
      `Error: Function:addNotes :, ${error.sqlMessage}`,
    );
  }
}
const getUserNotes = async (userId,vacationId) => {
  try {
    const sql = notesQuery.getUserNote(vacationId)
    const parameters = [userId]
    return await connection.executeWithParameters(sql,parameters)
  } catch (error) {
    logger.error(
      `Error: Function:getUserNotes :, ${error.sqlMessage}`,
    );
  }
}




module.exports = {
  addNotes,
  getUserNotes
}