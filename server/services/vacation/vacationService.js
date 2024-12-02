const vacationDb = require("./vacationDb")

const addVacation = async (vacationId) => {
    return await vacationDb.addVacation(vacationId)
}

module.exports = {
    addVacation
}