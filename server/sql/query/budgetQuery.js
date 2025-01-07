const getCategory = (vacationId) => {
    return `SELECT * FROM trip_tracker_${vacationId}.expenses_category;`
}

const getSubCategory = (vacationId) => {
    return `SELECT * FROM trip_tracker_${vacationId}.expenses_sub_category where expenses_category_id = ?;`
}

 const getExchangeRates = (vacationId) => {
    return `SELECT * FROM trip_tracker_${vacationId}.exchange_rates where ccy = ?;`
}

const addFutureExpenses = (vacationId) => {
    return `INSERT INTO trip_tracker_${vacationId}.future_expenses 
    (expenses_category_id,expenses_sub_category_id,expected_expenditure,expected_expenditure_ils,payment_date,payment_currency) VALUES (?,?,?,?,?,?)`
}
module.exports = {
    getCategory,
    getSubCategory,
    getExchangeRates,
    addFutureExpenses
}