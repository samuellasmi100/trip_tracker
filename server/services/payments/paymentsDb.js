const connection = require("../../db/connection-wrapper");
const paymentsQuery = require("../../sql/query/paymentsQuery")
const logger = require("../../utils/logger");

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
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
    return response
   
  } catch (error) { 
    logger.error(
      `Error: Function:getHistoryPayments :, ${error.sqlMessage}`,
    );
  }
}

const addPayments = async (paymentDetails,vacationId) => {
  const remainsToBePaid = Number(paymentDetails.remainsToBePaid)
  const amountReceived = Number(paymentDetails.amountReceived)
  const result = Number(remainsToBePaid) - Number(amountReceived)

  try {
    const sql = paymentsQuery.addPayments(vacationId)
    const parameters = [
      paymentDetails.paymentDate,
      paymentDetails.amount,
      paymentDetails.formOfPayment,
      result,
      paymentDetails.paymentCurrency,
      paymentDetails.amountReceived,
      paymentDetails.familyId,
      paymentDetails.userId,
      paymentDetails.invoice,
    ]
    if(paymentDetails.remainsToBePaid === "0" || paymentDetails.amountReceived === ""){
      const sql = paymentsQuery.updatePayments(vacationId)
      const parameters = [paymentDetails.invoice,paymentDetails.familyId,]
      await connection.executeWithParameters(sql,parameters)
    }else {
     await connection.executeWithParameters(sql,parameters)
    }
  } catch (error) { 
    logger.error(
      `Error: Function:addPayments :, ${error.sqlMessage}`,
    );
  }
}




module.exports = {
  addPayments,
  getPayments,
  getHistoryPayments
}