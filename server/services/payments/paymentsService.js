const paymentsDb = require("./paymentsDb")

const getPayments = async (id,vacationId) => {
    return await paymentsDb.getPayments(id,vacationId)
}

const getHistoryPayments = async (id,vacationId) => {
    return await paymentsDb.getHistoryPayments(id,vacationId)
}
const addPayments = async (paymentDetails,vacationId) => {
    return await paymentsDb.addPayments(paymentDetails,vacationId);  
}

module.exports = {
    addPayments,
    getPayments,
    getHistoryPayments
}