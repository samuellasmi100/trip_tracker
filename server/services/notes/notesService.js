const notesDb = require("./notesDb")



const addNotes = async (notesDetails,vacationId) => {
  await notesDb.addNotes(notesDetails,vacationId);
}




module.exports = {
    addNotes,
}