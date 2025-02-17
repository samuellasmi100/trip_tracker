const addPayments = (vacationId) => {
    return `INSERT INTO trip_tracker_${vacationId}.payments (payment_date,amount,form_of_payment,
    payment_currency,amount_received,family_id,user_id,invoice) values (?,?,?,?,?,?,?,?)`
}
const getPayments = (vacationId) => {
    return `SELECT id,family_id as familyId,payment_date as paymentDate ,amount,form_of_payment as formOfPayment,
    remains_to_be_paid as remainsToBePaid,payment_currency as paymentCurrency,amount_received as amountReceived,invoice,is_paid from trip_tracker_${vacationId}.payments WHERE family_id = ?`
}
const getHistoryPayments = (vacationId) => {
    return `SELECT family_id as familyId,
     DATE_FORMAT(payment_date, '%d/%m/%Y') AS paymentDate,amount,form_of_payment as formOfPayment,
    remains_to_be_paid as remainsToBePaid,payment_currency as paymentCurrency,updated_at,
    amount_received as amountReceived,invoice,is_paid from trip_tracker_${vacationId}.payments WHERE user_id = ? And is_paid = 1`
}
const updatePayments = (vacationId) => {
    return `UPDATE trip_tracker_${vacationId}.payments
    SET 
  updated_at = ?,
  form_of_payment = ?,
  payment_currency = ?,
  amount_received = ?,
  is_paid = ?
  WHERE family_id = ? And id = ?`
}

module.exports ={
    addPayments,
    getPayments,
    getHistoryPayments,
    updatePayments
}