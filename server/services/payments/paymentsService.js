const paymentsDb = require("./paymentsDb")

const getPayments = async (id) => {
    return await paymentsDb.getPayments(id)
}

const getHistoryPayments = async (id) => {
    return await paymentsDb.getHistoryPayments(id)
}
const addPayments = async (paymentDetails) => {
    return await paymentsDb.addPayments(paymentDetails);  
}

module.exports = {
    addPayments,
    getPayments,
    getHistoryPayments
}