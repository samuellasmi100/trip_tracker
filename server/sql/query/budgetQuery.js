const getCategory = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.expenses_category;`;
};

const getSubCategory = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.expenses_sub_category where expenses_category_id = ?;`;
};

const getExchangeRates = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.exchange_rates where ccy = ?;`;
};

const addFutureExpenses = (vacationId) => {
  return `INSERT INTO trip_tracker_${vacationId}.future_expenses 
    (expenses_category_id,expenses_sub_category_id,expenditure,expenditure_ils,payment_date,payment_currency,action_id) VALUES (?,?,?,?,?,?,?)`;
};

const addExpenses = (vacationId) => {
  return `INSERT INTO trip_tracker_${vacationId}.expenses 
    (expenses_category_id,expenses_sub_category_id,expenditure,expenditure_ils,planned_payment_date,actual_payment_date,payment_currency,action_id,is_paid,is_unexpected) VALUES (?,?,?,?,?,?,?,?,?,?)`;
};

const getFutureExpenses = (vacationId) => {
  return `SELECT 
fe.id,
fe.action_id,
fe.expenditure as expenditure0,
fe.payment_currency as paymentCurrency0,
fe.expenses_category_id as categories,
fe.expenses_sub_category_id as subCategories,
fe.payment_date as paymentDate0,
fe.expenditure_ils,
ec.name as categoryName,
esc.name as subCategoryName
FROM trip_tracker_${vacationId}.future_expenses fe
join trip_tracker_${vacationId}.expenses_category ec on ec.id = fe.expenses_category_id
join trip_tracker_${vacationId}.expenses_sub_category esc on esc.id = fe.expenses_sub_category_id;`;
};

const getExpenses = (vacationId) => {
  return `SELECT 
fe.id,
fe.action_id,
fe.expenditure as expenditure0,
fe.payment_currency as paymentCurrency0,
fe.expenses_category_id as categories,
fe.expenses_sub_category_id as subCategories,
fe.planned_payment_date as paymentDate0,
fe.actual_payment_date,
fe.expenditure_ils,
fe.is_paid,
fe.is_unexpected,
ec.name as categoryName,
esc.name as subCategoryName
FROM trip_tracker_${vacationId}.expenses fe
join trip_tracker_${vacationId}.expenses_category ec on ec.id = fe.expenses_category_id
join trip_tracker_${vacationId}.expenses_sub_category esc on esc.id = fe.expenses_sub_category_id;`;
};

const updateExpenses = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.expenses
  SET 
  expenditure = ?,
  actual_payment_date = ?,
  expenditure_ils = ?
  WHERE action_id = ?`
}
const updateFutureExpenses = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.future_expenses
  SET 
  expenditure = ?,
  expenditure_ils = ?
  WHERE action_id = ?`
}
const updateExpensesStatus = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.expenses
  SET 
  is_paid = ?,
  actual_payment_date = ?
  WHERE action_id = ?`
}
module.exports = {
  getCategory,
  getSubCategory,
  getExchangeRates,
  addFutureExpenses,
  getFutureExpenses,
  addExpenses,
  getExpenses,
  updateExpenses,
  updateFutureExpenses,
  updateExpensesStatus
};
