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
    (expenses_category_id,expenses_sub_category_id,expenditure,expenditure_ils,payment_date,payment_currency) VALUES (?,?,?,?,?,?)`;
};

const addExpenses = (vacationId) => {
  return `INSERT INTO trip_tracker_${vacationId}.expenses 
    (expenses_category_id,expenses_sub_category_id,expenditure,expenditure_ils,payment_date,payment_currency) VALUES (?,?,?,?,?,?)`;
};

const getFutureExpenses = (vacationId) => {
  return `SELECT 
fe.expenditure,
fe.payment_currency ,
fe.expenses_category_id,
fe.expenses_sub_category_id,
fe.payment_date ,
fe.expenditure_ils,
ec.name as categoryName,
esc.name as subCategoryName
FROM trip_tracker_${vacationId}.future_expenses fe
join trip_tracker_${vacationId}.expenses_category ec on ec.id = fe.expenses_category_id
join trip_tracker_${vacationId}.expenses_sub_category esc on esc.id = fe.expenses_sub_category_id;`;
};

const getExpenses = (vacationId) => {
  return `SELECT 
fe.expenditure,
fe.payment_currency ,
fe.expenses_category_id,
fe.expenses_sub_category_id,
fe.payment_date,
fe.expenditure_ils,
fe.is_paid,
ec.name as categoryName,
esc.name as subCategoryName
FROM trip_tracker_${vacationId}.expenses fe
join trip_tracker_${vacationId}.expenses_category ec on ec.id = fe.expenses_category_id
join trip_tracker_${vacationId}.expenses_sub_category esc on esc.id = fe.expenses_sub_category_id;`;
};
module.exports = {
  getCategory,
  getSubCategory,
  getExchangeRates,
  addFutureExpenses,
  getFutureExpenses,
  addExpenses,
  getExpenses
};
