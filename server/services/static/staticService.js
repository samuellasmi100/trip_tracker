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