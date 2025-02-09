const paymentsDb = require("./paymentsDb")

const getPayments = async (id, vacationId) => {
    return await paymentsDb.getPayments(id, vacationId)
}
const getHistoryPayments = async (id, vacationId) => {
    return await paymentsDb.getHistoryPayments(id, vacationId)
}
const addPayments = async (paymentDetails, vacationId) => {
  const checkIfUserAlradyaddPayments = await getPayments(paymentDetails.familyId,vacationId)
  if(checkIfUserAlradyaddPayments.length === 0){
    for (let i = 1; i <= Number(paymentDetails.number_of_payments); i++) {
        const amountReceived = paymentDetails[`amountReceived_${i}`];
        const paymentDate = paymentDetails[`paymentDate_${i}`];
        const paymentCurrency = paymentDetails[`paymentCurrency_${i}`];
        const formOfPayment = paymentDetails[`formOfPayment_${i}`];
        if (amountReceived && paymentDate && paymentCurrency && formOfPayment) {
            await paymentsDb.addPayments({
                amountReceived,
                amount: paymentDetails.amount,
                formOfPayment,
                paymentCurrency,
                paymentDate,
                familyId: paymentDetails.familyId,
                userId: paymentDetails.userId,
                invoice: paymentDetails.invoice,
                vacationId,
            });
        }
    }
  }else {
    for (let i = 1; i <= Number(paymentDetails.number_of_payments); i++) {
        const amountReceived = paymentDetails[`amountReceived_${i}`];
        const paymentDate = paymentDetails[`paymentDate_${i}`];
        const paymentCurrency = paymentDetails[`paymentCurrency_${i}`];
        const formOfPayment = paymentDetails[`formOfPayment_${i}`];
        const isPaid = paymentDetails[`isPaid_${i}`] === 0 ? false : true;
        const id = paymentDetails[`id_${i}`];
        if (amountReceived && paymentDate && paymentCurrency && formOfPayment) {
            await paymentsDb.updatePayments({
                paymentDate,
                formOfPayment,
                paymentCurrency,
                amountReceived,
                familyId: paymentDetails.familyId,
                vacationId,
                isPaid,
                id
            });
        }
    }
  }
}

module.exports = {
    addPayments,
    getPayments,
    getHistoryPayments
}