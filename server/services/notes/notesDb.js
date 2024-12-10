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




module.exports = {
  addNotes,
}