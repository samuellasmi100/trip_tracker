const addPayments = () => {
    return `INSERT INTO payments (parent_id,payment_date,amount,form_of_payment,
    remains_to_be_paid,payment_currency,amount_received) values (?,?,?,?,?,?,?)`
}
const updatePayments = () => {
    return `UPDATE payments SET payment = ? ,amount = ?,form_of_payment =?,
    remains_to_be_paid = ?,payment_currency = ?,amount_received = ? WHERE parent_id = ?`
}
const getPayments = () => {
    return `SELECT parent_id as parentId,payment_date as paymentDate ,amount,form_of_payment as formOfPayment,
    remains_to_be_paid as remainsToBePaid,payment_currency as paymentCurrency,amount_received as amountReceived from payments WHERE parent_id = ? ORDER BY id DESC`
}

module.exports ={
    addPayments,
  updatePayments,
  getPayments
}