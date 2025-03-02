const connection = require("../../db/connection-wrapper");
const paymentsQuery = require("../../sql/query/paymentsQuery")
const logger = require("../../utils/logger");
const moment = require("moment");

const getPayments = async (id,vacationId) => {
    try {
      const sql = paymentsQuery.getPayments(vacationId)
      const parameters = [id]
      const response = await connection.executeWithParameters(sql,parameters)
      return response
     
    } catch (error) { 
      logger.error(
        `Error: Function:getPayments :, ${error.sqlMessage}`,
      );
    }
}

const getHistoryPayments = async (id,vacationId) => {
  try {
    const sql = paymentsQuery.getHistoryPayments(vacationId)
    const parameters = [id,id]
    const response = await connection.executeWithParameters(sql,parameters)
    return response
   
  } catch (error) { 
    logger.error(
      `Error: Function:getHistoryPayments :, ${error.sqlMessage}`,
    );
  }
}

const addPayments = async (paymentDetails) => {
  try {
    const sql = paymentsQuery.addPayments(paymentDetails.vacationId) 
    const parameters = [
      paymentDetails.paymentDate,
      paymentDetails.amount,
      paymentDetails.formOfPayment,
      paymentDetails.paymentCurrency,
      paymentDetails.amountReceived,
      paymentDetails.familyId,
      paymentDetails.userId,
      paymentDetails.invoice === undefined ? false : paymentDetails.invoice
    ]
     await connection.executeWithParameters(sql,parameters)
  
  } catch (error) { 
    logger.error(
      `Error: Function:addPayments :, ${error.sqlMessage}`,
    );
  }
}

const updatePayments = async (paymentDetails) => {
  try {
    const sql = paymentsQuery.updatePayments(paymentDetails.vacationId)
    const parameters = [
      paymentDetails.paymentDate,
      paymentDetails.formOfPayment,
      paymentDetails.paymentCurrency,
      paymentDetails.amountReceived,
      paymentDetails.isPaid,
      paymentDetails.familyId,
      paymentDetails.id,
    ]
    await connection.executeWithParameters(sql,parameters)
    
  } catch (error) { 
    logger.error(
      `Error: Function:updatePayments :, ${error.sqlMessage}`,
    );
  }
}


module.exports = {
  addPayments,
  getPayments,
  getHistoryPayments,
  updatePayments
}