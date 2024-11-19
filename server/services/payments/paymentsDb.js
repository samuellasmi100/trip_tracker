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

const addPayments = async (paymentDetails) => {

  try {
    const sql = paymentsQuery.addPayments()
    const parameters = [
      paymentDetails.parentId,
      paymentDetails.paymentDate,
      paymentDetails.amount,
      paymentDetails.formOfPayment,
      paymentDetails.remainsToBePaid,
      paymentDetails.paymentCurrency,
      paymentDetails.amountReceived,
    ]
     await connection.executeWithParameters(sql,parameters)

   
  } catch (error) { 
    console.log(error)
  }
}

const updatePayments = async (paymentDetails) => {
  try {
    const sql = paymentsQuery.updatePayments()
    const parameters = [parentId,roomId]
     await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}


module.exports = {
  addPayments,
  getPayments,
  updatePayments
}