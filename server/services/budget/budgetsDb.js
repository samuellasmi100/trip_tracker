
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

const addFutureExpenses = async (vacationId,payment) => {
  try {
    const sql = budgetQuery.addFutureExpenses(vacationId)
    const parameters = [
      payment.categoryId,
      payment.subCategoryId,
      payment.expectedExpenditure,
      payment.expectedExpenditureILS,
      payment.paymentDate,
      payment.paymentCurrency,
    ]
 
    const response = await connection.executeWithParameters(sql,parameters)
    // return response
  } catch (error) { 
    logger.error(
      `Error: Function:addFutureExpenses :, ${error.sqlMessage}`,
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
      `Error: Function:addFutureExpenses :, ${error.sqlMessage}`,
    );
  }
}
//
module.exports = {
    getCategory,
    getSubCategory,
    getExchangeRates,
  addFutureExpenses
}