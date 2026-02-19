
const connection = require("../../db/connection-wrapper");
const budgetQuery = require("../../sql/query/budgetQuery")
const logger = require("../../utils/logger");
const moment = require("moment");

const getCategory = async (vacationId) => {
  try {
    const sql = budgetQuery.getCategory(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getCategory :, ${error.sqlMessage}`,
    );
  }
}

const getSubCategory = async (vacationId, categoryId) => {
  try {
    const sql = budgetQuery.getSubCategory(vacationId)
    const parameters = [categoryId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getSubCategory :, ${error.sqlMessage}`,
    );
  }
}

const getExchangeRates = async (vacationId, currency) => {
  try {
    const sql = budgetQuery.getExchangeRates(vacationId)
    const parameters = [currency]
    const response = await connection.executeWithParameters(sql, parameters)
    return response[0].amount
  } catch (error) {
    logger.error(
      `Error: Function:getExchangeRates :, ${error.sqlMessage}`,
    );
  }
}

const getAllExchangeRates = async (vacationId) => {
  try {
    const sql = budgetQuery.getAllExchangeRates(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getAllExchangeRates :, ${error.sqlMessage}`,
    );
  }
}

const upsertExchangeRate = async (vacationId, ccy, amount) => {
  try {
    // Check if rate exists for this currency
    const sql = budgetQuery.getExchangeRates(vacationId)
    const existing = await connection.executeWithParameters(sql, [ccy])
    if (existing && existing.length > 0) {
      const updateSql = budgetQuery.updateExchangeRate(vacationId)
      await connection.executeWithParameters(updateSql, [amount, ccy])
    } else {
      const insertSql = budgetQuery.insertExchangeRate(vacationId)
      await connection.executeWithParameters(insertSql, [ccy, amount])
    }
  } catch (error) {
    logger.error(
      `Error: Function:upsertExchangeRate :, ${error.sqlMessage}`,
    );
  }
}

const addFutureExpenses = async (vacationId, payment) => {
  try {
    const sql = budgetQuery.addFutureExpenses(vacationId)
    const parameters = [
      payment.categoryId,
      payment.subCategoryId,
      payment.expenditure,
      payment.expenditureILS,
      payment.paymentDate,
      payment.paymentCurrency,
      payment.actionId
    ]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(
      `Error: Function:addFutureExpenses :, ${error.sqlMessage}`,
    );
  }
}

const getFutureExpenses = async (vacationId) => {
  try {
    const sql = budgetQuery.getFutureExpenses(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getFutureExpenses :, ${error.sqlMessage}`,
    );
  }
}

const addExpenses = async (vacationId, payment) => {
  try {
    const sql = budgetQuery.addExpenses(vacationId)
    const parameters = [
      payment.categoryId,
      payment.subCategoryId,
      payment.expenditure,
      payment.expenditureILS,
      payment.paymentDate,
      payment.actualPaymentDateDate,
      payment.paymentCurrency,
      payment.actionId,
      payment.isPaid,
      payment.isUnexpected
    ]

    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(
      `Error: Function:addExpenses :, ${error.sqlMessage}`,
    );
  }
}

const getExpenses = async (vacationId) => {
  try {
    const sql = budgetQuery.getExpenses(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(
      `Error: Function:getExpenses :, ${error.sqlMessage}`,
    );
  }
}

const updateExpenses = async (vacationId, payment) => {
  try {
    const sql = budgetQuery.updateExpenses(vacationId)
    const parameters = [
      payment.expenditure0,
      payment.paymentDate0,
      payment.expenditureILS,
      payment.action_id
    ]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(
      `Error: Function:updateExpenses :, ${error.sqlMessage}`,
    );
  }
}

const updateExpensesStatus = async (vacationId, expensesId,paymentStatus) => {
  try {
    const actualPaymentDateDate = moment().format('YYYY-MM-DD');
    const sql = budgetQuery.updateExpensesStatus(vacationId)
    const parameters = [
      paymentStatus ? true : false,
      paymentStatus === false ? "" : actualPaymentDateDate,
      expensesId
    ]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(
      `Error: Function:updateExpensesStatus :, ${error.sqlMessage}`,
    );
  }
}

const updateFutureExpenses = async (vacationId, payment) => {
  try {
    const sql = budgetQuery.updateFutureExpenses(vacationId)
    const parameters = [
      payment.expenditure0,
      payment.paymentDate0,
      payment.expenditureILS,
      payment.action_id
    ]

    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(
      `Error: Function:updateFutureExpenses :, ${error.sqlMessage}`,
    );
  }
}

// --- EXPENSE CATEGORY CRUD ---
const addCategory = async (vacationId, name) => {
  try {
    const sql = budgetQuery.addCategory(vacationId)
    const parameters = [name]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:addCategory :, ${error.sqlMessage}`)
  }
}

const updateCategoryDb = async (vacationId, id, name) => {
  try {
    const sql = budgetQuery.updateCategory(vacationId)
    const parameters = [name, id]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:updateCategory :, ${error.sqlMessage}`)
  }
}

const deleteCategory = async (vacationId, id) => {
  try {
    const sql = budgetQuery.deleteCategory(vacationId)
    const parameters = [id]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:deleteCategory :, ${error.sqlMessage}`)
  }
}

// --- EXPENSE SUBCATEGORY CRUD ---
const addSubCategory = async (vacationId, categoryId, name) => {
  try {
    const sql = budgetQuery.addSubCategory(vacationId)
    const parameters = [categoryId, name]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:addSubCategory :, ${error.sqlMessage}`)
  }
}

const updateSubCategory = async (vacationId, id, name) => {
  try {
    const sql = budgetQuery.updateSubCategory(vacationId)
    const parameters = [name, id]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:updateSubCategory :, ${error.sqlMessage}`)
  }
}

const deleteSubCategory = async (vacationId, id) => {
  try {
    const sql = budgetQuery.deleteSubCategory(vacationId)
    const parameters = [id]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:deleteSubCategory :, ${error.sqlMessage}`)
  }
}

// --- INCOME CATEGORY CRUD ---
const getIncomeCategory = async (vacationId) => {
  try {
    const sql = budgetQuery.getIncomeCategory(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(`Error: Function:getIncomeCategory :, ${error.sqlMessage}`)
  }
}

const addIncomeCategory = async (vacationId, name) => {
  try {
    const sql = budgetQuery.addIncomeCategory(vacationId)
    const parameters = [name]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:addIncomeCategory :, ${error.sqlMessage}`)
  }
}

const updateIncomeCategory = async (vacationId, id, name) => {
  try {
    const sql = budgetQuery.updateIncomeCategory(vacationId)
    const parameters = [name, id]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:updateIncomeCategory :, ${error.sqlMessage}`)
  }
}

const deleteIncomeCategory = async (vacationId, id) => {
  try {
    const sql = budgetQuery.deleteIncomeCategory(vacationId)
    const parameters = [id]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:deleteIncomeCategory :, ${error.sqlMessage}`)
  }
}

// --- INCOME SUBCATEGORY CRUD ---
const getIncomeSubCategory = async (vacationId, categoryId) => {
  try {
    const sql = budgetQuery.getIncomeSubCategory(vacationId)
    const parameters = [categoryId]
    const response = await connection.executeWithParameters(sql, parameters)
    return response
  } catch (error) {
    logger.error(`Error: Function:getIncomeSubCategory :, ${error.sqlMessage}`)
  }
}

const addIncomeSubCategory = async (vacationId, categoryId, name) => {
  try {
    const sql = budgetQuery.addIncomeSubCategory(vacationId)
    const parameters = [categoryId, name]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:addIncomeSubCategory :, ${error.sqlMessage}`)
  }
}

const updateIncomeSubCategory = async (vacationId, id, name) => {
  try {
    const sql = budgetQuery.updateIncomeSubCategory(vacationId)
    const parameters = [name, id]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:updateIncomeSubCategory :, ${error.sqlMessage}`)
  }
}

const deleteIncomeSubCategory = async (vacationId, id) => {
  try {
    const sql = budgetQuery.deleteIncomeSubCategory(vacationId)
    const parameters = [id]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:deleteIncomeSubCategory :, ${error.sqlMessage}`)
  }
}

// --- INCOME CRUD ---
const addIncome = async (vacationId, payment) => {
  try {
    const sql = budgetQuery.addIncome(vacationId)
    const parameters = [
      payment.categoryId,
      payment.subCategoryId,
      payment.expenditure,
      payment.expenditureILS,
      payment.paymentDate,
      payment.actualPaymentDate,
      payment.paymentCurrency,
      payment.actionId,
      payment.isPaid,
      payment.description
    ]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:addIncome :, ${error.sqlMessage}`)
  }
}

const getIncome = async (vacationId) => {
  try {
    const sql = budgetQuery.getIncome(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(`Error: Function:getIncome :, ${error.sqlMessage}`)
  }
}

const updateIncome = async (vacationId, payment) => {
  try {
    const sql = budgetQuery.updateIncome(vacationId)
    const parameters = [
      payment.expenditure0,
      payment.paymentDate0,
      payment.expenditureILS,
      payment.description || "",
      payment.action_id
    ]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:updateIncome :, ${error.sqlMessage}`)
  }
}

const updateIncomeStatus = async (vacationId, actionId, paymentStatus) => {
  try {
    const actualPaymentDate = moment().format('YYYY-MM-DD');
    const sql = budgetQuery.updateIncomeStatus(vacationId)
    const parameters = [
      paymentStatus ? true : false,
      paymentStatus === false ? "" : actualPaymentDate,
      actionId
    ]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:updateIncomeStatus :, ${error.sqlMessage}`)
  }
}

const deleteIncome = async (vacationId, actionId) => {
  try {
    const sql = budgetQuery.deleteIncome(vacationId)
    const parameters = [actionId]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:deleteIncome :, ${error.sqlMessage}`)
  }
}

// --- DELETE EXPENSE ---
const deleteExpense = async (vacationId, actionId) => {
  try {
    const sql = budgetQuery.deleteExpense(vacationId)
    const parameters = [actionId]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:deleteExpense :, ${error.sqlMessage}`)
  }
}

const deleteFutureExpense = async (vacationId, actionId) => {
  try {
    const sql = budgetQuery.deleteFutureExpense(vacationId)
    const parameters = [actionId]
    await connection.executeWithParameters(sql, parameters)
  } catch (error) {
    logger.error(`Error: Function:deleteFutureExpense :, ${error.sqlMessage}`)
  }
}

// --- SUMMARY ---
const getSummary = async (vacationId) => {
  try {
    const sql = budgetQuery.getSummary(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(`Error: Function:getSummary :, ${error.sqlMessage}`)
  }
}

const getExpensesByCategory = async (vacationId) => {
  try {
    const sql = budgetQuery.getExpensesByCategory(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(`Error: Function:getExpensesByCategory :, ${error.sqlMessage}`)
  }
}

const getIncomeByCategory = async (vacationId) => {
  try {
    const sql = budgetQuery.getIncomeByCategory(vacationId)
    const response = await connection.execute(sql)
    return response
  } catch (error) {
    logger.error(`Error: Function:getIncomeByCategory :, ${error.sqlMessage}`)
  }
}

module.exports = {
  getCategory,
  getSubCategory,
  getExchangeRates,
  getAllExchangeRates,
  upsertExchangeRate,
  addFutureExpenses,
  getFutureExpenses,
  getExpenses,
  addExpenses,
  updateExpenses,
  updateFutureExpenses,
  updateExpensesStatus,
  addCategory,
  updateCategory: updateCategoryDb,
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
}