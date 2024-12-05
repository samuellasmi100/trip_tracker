const getAll = (vacationId) => {
return `SELECT note FROM trip_tracker_${vacationId}.notes;`
}
const addNotes = (vacationId) => {
    return `INSERT INTO trip_tracker_${vacationId}.notes (note,user_id,family_id,category_name) VALUES (?,?,?,?)`
}
const getUserNote = (vacationId) => {
    return `SELECT * FROM trip_tracker_${vacationId}.notes where user_id = ?;`
}
const getFamilyNote = (vacationId) => {
    return `SELECT * FROM trip_tracker_${vacationId}.notes where family_id = ?;`
}



module.exports = {
    getAll,
    addNotes,
    getUserNote,
    getFamilyNote
  }