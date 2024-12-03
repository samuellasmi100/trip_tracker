const vacationDb = require("./vacationDb")

const addVacation = async (vacationId,vacationDetails) => {
    const saveVacationDetails = await vacationDb.addVacation(vacationId,vacationDetails)
    // const createSchemaForVacation = await vacationDb.addVacation(vacationId,vacationDetails)
    // return await vacationDb.addVacation(vacationId)
}

module.exports = {
    addVacation
}