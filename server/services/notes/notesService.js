const notesDb = require("./notesDb")

const getAll = async () => {
    return notesDb.getAll()
}

const addNotes = async (notesDetails) => {
  await notesDb.addNotes(notesDetails);
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
const getFamilyNote = async (id) => {
    return notesDb.getFamilyNote(id)
}


module.exports = {
    getAll,
    addNotes,
    getParentNote,
    getChildNote,
    addChildNotes,
    getFamilyNote
}