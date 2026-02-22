const staticDb = require("./staticDb")

const getMainGuests = async (vacationId, search, limit, offset) => {
    return await staticDb.getMainGuests(vacationId, search, limit, offset)
}

const getAllGuests = async (vacationId, search, limit, offset) => {
    return await staticDb.getAllGuests(vacationId, search, limit, offset)
}

const getFlightsDetails = async (vacationId) => {
    return await staticDb.getFlightsDetails(vacationId)
}

const getVacationDetails = async (vacationId, search, limit, offset) => {
    return await staticDb.getVacationDetails(vacationId, search, limit, offset)
}

const getPaymentsDetails = async (vacationId) => {
    const payments = await staticDb.getPaymentsDetails(vacationId)
    const uniquePaymentsAndGuests = payments.reduce((acc, current) => {
        if (!acc.some(item => item.familyId === current.familyId)) {
            acc.push(current);
        }
        return acc;
    }, []);
    return uniquePaymentsAndGuests
}

module.exports = {
    getMainGuests,
    getAllGuests,
    getFlightsDetails,
    getVacationDetails,
    getPaymentsDetails,
}
