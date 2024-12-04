const vacationDb = require("./vacationDb")

const addVacation = async (vacationId,vacationDetails) => {
    const saveVacationDetails = await vacationDb.addVacation(vacationDetails,vacationId)
    // const createSchemaForVacation = await vacationDb.addVacation(vacationId,vacationDetails)
    // return await vacationDb.addVacation(vacationId)
}

module.exports = {
    addVacation
}