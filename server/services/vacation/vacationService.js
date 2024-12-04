const vacationDb = require("./vacationDb")

const addVacation = async (vacationId,vacationDetails) => {
     await vacationDb.addVacation(vacationDetails,vacationId)
}

const getVacations = async () => {
    return await vacationDb.getVacations()
}
module.exports = {
    addVacation,
    getVacations
}