const getCategory = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.expenses_category;`;
};

const getSubCategory = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.expenses_sub_category where expenses_category_id = ?;`;
};

const getExchangeRates = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.exchange_rates where ccy = ?;`;
};

const getAllExchangeRates = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.exchange_rates;`;
};

const updateExchangeRate = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.exchange_rates SET amount = ? WHERE ccy = ?;`;
};

const insertExchangeRate = (vacationId) => {
  return `INSERT INTO trip_tracker_${vacationId}.exchange_rates (ccy, amount) VALUES (?, ?);`;
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
// --- EXPENSE CATEGORY CRUD ---
const addCategory = (vacationId) => {
  return `INSERT INTO trip_tracker_${vacationId}.expenses_category (name) VALUES (?);`;
};

const updateCategory = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.expenses_category SET name = ? WHERE id = ?;`;
};

const deleteCategory = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.expenses_category WHERE id = ?;`;
};

// --- EXPENSE SUBCATEGORY CRUD ---
const addSubCategory = (vacationId) => {
  return `INSERT INTO trip_tracker_${vacationId}.expenses_sub_category (expenses_category_id, name) VALUES (?, ?);`;
};

const updateSubCategory = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.expenses_sub_category SET name = ? WHERE id = ?;`;
};

const deleteSubCategory = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.expenses_sub_category WHERE id = ?;`;
};

// --- INCOME CATEGORY CRUD ---
const getIncomeCategory = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.income_category;`;
};

const addIncomeCategory = (vacationId) => {
  return `INSERT INTO trip_tracker_${vacationId}.income_category (name) VALUES (?);`;
};

const updateIncomeCategory = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.income_category SET name = ? WHERE id = ?;`;
};

const deleteIncomeCategory = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.income_category WHERE id = ?;`;
};

// --- INCOME SUBCATEGORY CRUD ---
const getIncomeSubCategory = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.income_sub_category WHERE income_category_id = ?;`;
};

const addIncomeSubCategory = (vacationId) => {
  return `INSERT INTO trip_tracker_${vacationId}.income_sub_category (income_category_id, name) VALUES (?, ?);`;
};

const updateIncomeSubCategory = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.income_sub_category SET name = ? WHERE id = ?;`;
};

const deleteIncomeSubCategory = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.income_sub_category WHERE id = ?;`;
};

// --- INCOME CRUD ---
const addIncome = (vacationId) => {
  return `INSERT INTO trip_tracker_${vacationId}.income
    (expenses_category_id,expenses_sub_category_id,expenditure,expenditure_ils,planned_payment_date,actual_payment_date,payment_currency,action_id,is_paid,description) VALUES (?,?,?,?,?,?,?,?,?,?)`;
};

const getIncome = (vacationId) => {
  return `SELECT
i.id,
i.action_id,
i.expenditure as expenditure0,
i.payment_currency as paymentCurrency0,
i.expenses_category_id as categories,
i.expenses_sub_category_id as subCategories,
i.planned_payment_date as paymentDate0,
i.actual_payment_date,
i.expenditure_ils,
i.is_paid,
i.description,
ic.name as categoryName,
isc.name as subCategoryName
FROM trip_tracker_${vacationId}.income i
JOIN trip_tracker_${vacationId}.income_category ic ON ic.id = i.expenses_category_id
JOIN trip_tracker_${vacationId}.income_sub_category isc ON isc.id = i.expenses_sub_category_id;`;
};

const updateIncome = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.income
  SET
  expenditure = ?,
  planned_payment_date = ?,
  expenditure_ils = ?,
  description = ?
  WHERE action_id = ?`;
};

const updateIncomeStatus = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.income
  SET
  is_paid = ?,
  actual_payment_date = ?
  WHERE action_id = ?`;
};

const deleteIncome = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.income WHERE action_id = ?;`;
};

// --- DELETE EXPENSE ---
const deleteExpense = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.expenses WHERE action_id = ?;`;
};

const deleteFutureExpense = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.future_expenses WHERE action_id = ?;`;
};

// --- SUMMARY AGGREGATES ---
const getSummary = (vacationId) => {
  return `
    SELECT
      'expense' as record_type,
      COALESCE(SUM(CASE WHEN is_paid = 1 THEN expenditure_ils ELSE 0 END), 0) as total_paid,
      COALESCE(SUM(CASE WHEN is_paid = 0 THEN expenditure_ils ELSE 0 END), 0) as total_unpaid,
      COALESCE(SUM(expenditure_ils), 0) as total
    FROM trip_tracker_${vacationId}.expenses
    UNION ALL
    SELECT
      'income' as record_type,
      COALESCE(SUM(CASE WHEN is_paid = 1 THEN expenditure_ils ELSE 0 END), 0) as total_paid,
      COALESCE(SUM(CASE WHEN is_paid = 0 THEN expenditure_ils ELSE 0 END), 0) as total_unpaid,
      COALESCE(SUM(expenditure_ils), 0) as total
    FROM trip_tracker_${vacationId}.income;`;
};

const getExpensesByCategory = (vacationId) => {
  return `SELECT
    ec.name as categoryName,
    COALESCE(SUM(e.expenditure_ils), 0) as total
    FROM trip_tracker_${vacationId}.expenses e
    JOIN trip_tracker_${vacationId}.expenses_category ec ON ec.id = e.expenses_category_id
    GROUP BY ec.name;`;
};

const getIncomeByCategory = (vacationId) => {
  return `SELECT
    ic.name as categoryName,
    COALESCE(SUM(i.expenditure_ils), 0) as total
    FROM trip_tracker_${vacationId}.income i
    JOIN trip_tracker_${vacationId}.income_category ic ON ic.id = i.expenses_category_id
    GROUP BY ic.name;`;
};

module.exports = {
  getCategory,
  getSubCategory,
  getExchangeRates,
  getAllExchangeRates,
  updateExchangeRate,
  insertExchangeRate,
  addFutureExpenses,
  getFutureExpenses,
  addExpenses,
  getExpenses,
  updateExpenses,
  updateFutureExpenses,
  updateExpensesStatus,
  addCategory,
  updateCategory,
  deleteCategory,
  addSubCategory,
  updateSubCategory,
  deleteSubCategory,
  getIncomeCategory,
  addIncomeCategory,
  updateIncomeCategory,
  deleteIncomeCategory,
  getIncomeSubCategory,
  addIncomeSubCategory,
  updateIncomeSubCategory,
  deleteIncomeSubCategory,
  addIncome,
  getIncome,
  updateIncome,
  updateIncomeStatus,
  deleteIncome,
  deleteExpense,
  deleteFutureExpense,
  getSummary,
  getExpensesByCategory,
  getIncomeByCategory,
};
