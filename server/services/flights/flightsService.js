const flightsDb = require("./flightsDb")

const addParentFlightsDetails = async (paymentsData) => {
    return await flightsDb.addParentFlightsDetails(paymentsData)
}
const addChildFlightsDetails = async (paymentsData) => {
    return await flightsDb.addChildFlightsDetails(paymentsData)
}
const updateParentFlightsDetails = async (paymentsData) => {
    return await flightsDb.updateParentFlightsDetails(paymentsData)
}
const getParentDetails = async (id) => {
    return await flightsDb.getParentDetails(id)
}
const getChildDetails = async (id) => {
    return await flightsDb.getChildDetails(id)
}
const updateChildrenFlightsDetails = async (paymentsData) => {
    return await flightsDb.updateChildrenFlightsDetails(paymentsData)
}
module.exports = {
    addParentFlightsDetails,
    addChildFlightsDetails,
    updateParentFlightsDetails,
    getParentDetails,
    getChildDetails,
    updateChildrenFlightsDetails
}