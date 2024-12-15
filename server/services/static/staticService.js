const staticDb = require("./staticDb")

const getMainGuests = async (vacationId) => {
    return await staticDb.getMainGuests(vacationId)
}

const getAllGuests = async (vacationId) => {
    return await staticDb.getAllGuests(vacationId)
}

const getFlightsDetails = async (vacationId) => {
    return await staticDb.getFlightsDetails(vacationId)
}

const getVacationDetails = async (vacationId) => {
    return await staticDb.getVacationDetails(vacationId)
}
module.exports = {
    getMainGuests,
    getAllGuests,
    getFlightsDetails,
    getVacationDetails
}