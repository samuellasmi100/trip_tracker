const getAll = () => {
return `SELECT note FROM notes;`
}
const addParentNotes = () => {
    return `INSERT INTO notes (note,parent_id,family_id,category_name) VALUES (?,?,?,?)`
}
const addChildNotes = () => {
    return `INSERT INTO notes (note,child_id,family_id,category_name) VALUES (?,?,?,?)`
}
const getParentNote = () => {
    return `SELECT * FROM notes where parent_id = ?;`
}
const getFamilyNote = () => {
    return `SELECT * FROM notes where family_id = ?;`
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
    getFamilyNote
  }