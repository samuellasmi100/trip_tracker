const addVacation = () => {
 `INSERT INTO  vacations (name,vacation_id) VALUES (?,?)`
//  return `CREATE SCHEMA trip_tracket_${vacationId} ;`
}

module.exports = {
    addVacation
}