const addPayments = (vacationId) => {
    return `INSERT INTO trip_tracker_${vacationId}.payments (payment_date,amount,form_of_payment,
    remains_to_be_paid,payment_currency,amount_received,family_id) values (?,?,?,?,?,?,?)`
}
const getPayments = (vacationId) => {
    return `SELECT family_id as familyId,payment_date as paymentDate ,amount,form_of_payment as formOfPayment,
    remains_to_be_paid as remainsToBePaid,payment_currency as paymentCurrency,amount_received as amountReceived from trip_tracker_${vacationId}.payments WHERE family_id = ? ORDER BY id DESC limit 1`
}
const getHistoryPayments = (vacationId) => {
    return `SELECT family_id as familyId,payment_date as paymentDate ,amount,form_of_payment as formOfPayment,
    remains_to_be_paid as remainsToBePaid,payment_currency as paymentCurrency,amount_received as amountReceived from trip_tracker_${vacationId}.payments WHERE family_id = ?`
}

module.exports ={
    addPayments,
    getPayments,
    getHistoryPayments
}