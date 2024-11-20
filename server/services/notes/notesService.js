const notesDb = require("./notesDb")

const getAll = async () => {
    return notesDb.getAll()
}

const addParentNotes = async (notesDetails) => {
  await notesDb.addParentNotes(notesDetails);
}

const addChildNotes = async (notesDetails) => {
    await notesDb.addChildNotes(notesDetails);
}
 
const getParentNote = async (id) => {
    return notesDb.getParentNote(id)
}

const getChildNote = async (id) => {
    return notesDb.getChildNote(id)
}


module.exports = {
    getAll,
    addParentNotes,
    getParentNote,
    getChildNote,
    addChildNotes
}