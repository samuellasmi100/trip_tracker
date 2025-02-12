
const connection = require("../../db/connection-wrapper");
const budgetQuery = require("../../sql/query/budgetQuery")
const logger = require("../../utils/logger");

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

const getSubCategory = async (vacationId,categoryId) => {
  try {
    const sql = budgetQuery.getSubCategory(vacationId)
    const parameters = [categoryId]
    const response = await connection.executeWithParameters(sql,parameters)
    return response
  } catch (error) { 
    logger.error(
      `Error: Function:getSubCategory :, ${error.sqlMessage}`,
    );
  }
}

const getExchangeRates = async (vacationId,currency) => {
  try {
    const sql = budgetQuery.getExchangeRates(vacationId)
    const parameters = [currency]
    const response = await connection.executeWithParameters(sql,parameters)
    return response[0].amount
  } catch (error) { 
    logger.error(
      `Error: Function:getExchangeRates :, ${error.sqlMessage}`,
    );
  }
}

const addFutureExpenses = async (vacationId,payment) => {
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
    await connection.executeWithParameters(sql,parameters)
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

const addExpenses = async (vacationId,payment) => {
  try {
    const sql = budgetQuery.addExpenses(vacationId)
    const parameters = [
      payment.categoryId,
      payment.subCategoryId,
      payment.expenditure,
      payment.expenditureILS,
      payment.paymentDate,
      payment.paymentCurrency,
      payment.actionId
    ]
 
     await connection.executeWithParameters(sql,parameters)
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

const updateExpenses = async (vacationId,payment) => {
  try {
    const sql = budgetQuery.updateExpenses(vacationId)
    const parameters = [
      payment.expenditure0,
      payment.paymentDate0,
      payment.expenditureILS,
      payment.action_id
    ]
     await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    logger.error(
      `Error: Function:updateExpenses :, ${error.sqlMessage}`,
    );
  }
}
const updateFutureExpenses = async (vacationId,payment) => {
  try {
    const sql = budgetQuery.updateFutureExpenses(vacationId)
    const parameters = [
      payment.expenditure0,
      payment.paymentDate0,
      payment.expenditureILS,
      payment.action_id
    ]
 
     await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    logger.error(
      `Error: Function:updateFutureExpenses :, ${error.sqlMessage}`,
    );
  }
}
module.exports = {
    getCategory,
    getSubCategory,
    getExchangeRates,
  addFutureExpenses,
  getFutureExpenses,
  getExpenses,
  addExpenses,
  updateExpenses,
updateFutureExpenses
}