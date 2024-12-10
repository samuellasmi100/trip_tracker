const notesDb = require("./notesDb")

const addNotes = async (notesDetails,vacationId) => {
  await notesDb.addNotes(notesDetails,vacationId);
}
const getUserNotes = async (userId,vacationId) => {
  await notesDb.getUserNotes(userId,vacationId);
}

module.exports = {
    addNotes,
    getUserNotes
}