const connection = require("../../db/connection-wrapper");
const notesQuery = require("../../sql/query/notesQuery")

const getAll = async () => {
    try {
      const sql = notesQuery.getAll()
      const response = await connection.execute(sql)
      return response
     
    } catch (error) { 
      console.log(error)
    }
}

const addParentNotes = async (noteDetails) => {
  try {
    const sql = notesQuery.addParentNotes()
    const parameters = [noteDetails.note,noteDetails.parent_id,noteDetails.family_id]
     await connection.executeWithParameters(sql,parameters)   
  } catch (error) { 
    console.log(error)
  }
}

const addChildNotes = async (noteDetails) => {
  try {
    const sql = notesQuery.addChildNotes()
    const parameters = [noteDetails.note,noteDetails.child_id,noteDetails.family_id]
     await connection.executeWithParameters(sql,parameters)   
  } catch (error) { 
    console.log(error)
  }
}

const getParentNote = async (id) => {
  try {
    const sql = notesQuery.getParentNote()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
   return response
  } catch (error) { 
    console.log(error)
  }
}

const getChildNote = async (id) => {
  try {
    const sql = notesQuery.getChildNote()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
    return response 
  } catch (error) { 
    console.log(error)
  }
}
const getFamilyNote = async (id) => {
  try {
    const sql = notesQuery.getFamilyNote()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
    return response 
  } catch (error) { 
    console.log(error)
  }
}


module.exports = {
  getAll,
  addParentNotes,
  addChildNotes,
  getParentNote,
  getChildNote,
  getFamilyNote
}