const paymentsDb = require("./paymentsDb")

const getPayments = async (id) => {
    return paymentsDb.getPayments(id)
}

const addPayments = async (paymentDetails) => {
    return await paymentsDb.addPayments(paymentDetails);  
}

const updatePayments = async (paymentDetails) => {
    return await paymentsDb.updatePayments(paymentDetails);  
}
module.exports = {
    addPayments,
    getPayments,
    updatePayments
}