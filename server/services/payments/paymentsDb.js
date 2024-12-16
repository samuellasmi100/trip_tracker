const connection = require("../../db/connection-wrapper");
const paymentsQuery = require("../../sql/query/paymentsQuery")

const getPayments = async (id,vacationId) => {
    try {
      const sql = paymentsQuery.getPayments(vacationId)
      const parameters = [id]
      const response = await connection.executeWithParameters(sql,parameters)
      return response
     
    } catch (error) { 
      console.log(error)
    }
}

const getHistoryPayments = async (id,vacationId) => {
  try {
    const sql = paymentsQuery.getHistoryPayments(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
    return response
   
  } catch (error) { 
    console.log(error)
  }
}


const numericAmount = (val) => {
  return  parseFloat(val.replace(/,/g, ""));
 }

const addPayments = async (paymentDetails,vacationId) => {
  const remainsToBePaid = numericAmount(paymentDetails.remainsToBePaid)
  const amountReceived = numericAmount(paymentDetails.amountReceived)
  const result = remainsToBePaid - amountReceived
  const rawValue = result.toString().replace(/,/g, "");
  const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  try {
    const sql = paymentsQuery.addPayments(vacationId)
    const parameters = [
      paymentDetails.paymentDate,
      paymentDetails.amount,
      paymentDetails.formOfPayment,
      paymentDetails.remainsToBePaid === "" ? numericAmount(paymentDetails.amount) - numericAmount(paymentDetails.amountReceived) : formattedValue,
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
    console.log(error)
  }
}




module.exports = {
  addPayments,
  getPayments,
  getHistoryPayments
}