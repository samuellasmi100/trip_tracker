const addVacation = (vacationId) => {
 return `CREATE SCHEMA trip_tracket_${vacationId} ;`
}
module.exports = {
    addVacation
}