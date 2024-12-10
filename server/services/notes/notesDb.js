const connection = require("../../db/connection-wrapper");
const notesQuery = require("../../sql/query/notesQuery")



const addNotes = async (noteDetails,vacationId) => {
  console.log(noteDetails)
  try {
    const sql = notesQuery.addNotes(vacationId)
    const parameters = [noteDetails.note,noteDetails.user_id,noteDetails.family_id,noteDetails.categoryName]
     await connection.executeWithParameters(sql,parameters)   
  } catch (error) { 
    console.log(error)
  }
}
const getUserNotes = async (userId,vacationId) => {
  try {
    const sql = notesQuery.getUserNote(vacationId)
    const parameters = [userId]
     await connection.executeWithParameters(sql,parameters)   
  } catch (error) { 
    console.log(error)
  }
}




module.exports = {
  addNotes,
  getUserNotes
}