const flightsDb = require("./flightsDb")

const addParentFlightsDetails = async (paymentsData) => {
    return flightsDb.addParentFlightsDetails(paymentsData)
}
const addChildFlightsDetails = async (paymentsData) => {
    return flightsDb.addChildFlightsDetails(paymentsData)
}
const updateParentFlightsDetails = async (paymentsData) => {
    return flightsDb.updateParentFlightsDetails(paymentsData)
}
const getParentDetails = async (id) => {
    return flightsDb.getParentDetails(id)
}
const getChildDetails = async (id) => {
    return flightsDb.getChildDetails(id)
}
module.exports = {
    addParentFlightsDetails,
    addChildFlightsDetails,
    updateParentFlightsDetails,
    getParentDetails,
    getChildDetails
}