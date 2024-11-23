const connection = require("../../db/connection-wrapper");
const paymentsQuery = require("../../sql/query/paymentsQuery")

const getPayments = async (id) => {
    try {
      const sql = paymentsQuery.getPayments()
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

const addPayments = async (paymentDetails) => {

  const remainsToBePaid = numericAmount(paymentDetails.remainsToBePaid)
  const amountReceived = numericAmount(paymentDetails.amountReceived)
  const result = remainsToBePaid - amountReceived
  const rawValue = result.toString().replace(/,/g, "");
  const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  try {
    const sql = paymentsQuery.addPayments()
    const parameters = [
      paymentDetails.paymentDate,
      paymentDetails.amount,
      paymentDetails.formOfPayment,
      paymentDetails.remainsToBePaid === "" ? numericAmount(paymentDetails.amount) - numericAmount(paymentDetails.amountReceived) : formattedValue,
      paymentDetails.paymentCurrency,
      paymentDetails.amountReceived,
      paymentDetails.familyId,
    ]
     await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}




module.exports = {
  addPayments,
  getPayments
}