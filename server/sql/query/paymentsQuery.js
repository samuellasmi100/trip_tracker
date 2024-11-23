const addPayments = () => {
    return `INSERT INTO payments (payment_date,amount,form_of_payment,
    remains_to_be_paid,payment_currency,amount_received,family_id) values (?,?,?,?,?,?,?)`
}
const getPayments = () => {
    return `SELECT family_id as familyId,payment_date as paymentDate ,amount,form_of_payment as formOfPayment,
    remains_to_be_paid as remainsToBePaid,payment_currency as paymentCurrency,amount_received as amountReceived from payments WHERE family_id = ? ORDER BY id DESC limit 1`
}

module.exports ={
    addPayments,
    getPayments
}