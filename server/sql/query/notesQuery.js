const getAll = () => {
return `SELECT note FROM notes;`
}
const addParentNotes = () => {
    return `INSERT INTO notes (note,parent_id) VALUES (?,?)`
}
const addChildNotes = () => {
    return `INSERT INTO notes (note,child_id,parent_id) VALUES (?,?,?)`
}
const getParentNote = () => {
    return `SELECT * FROM notes where parent_id = ?;`
}
const getChildNote = () => {
    return `SELECT * FROM notes where child_id = ?;`
}


module.exports = {
    getAll,
    addParentNotes,
    addChildNotes,
    getParentNote,
    getChildNote,
  }