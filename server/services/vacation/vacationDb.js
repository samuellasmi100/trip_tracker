const connection = require("../../db/connection-wrapper");
const vacationQuery = require("../../sql/query/vacationQuery")

const addVacation = async (vacationId) => {

  try {
    const sqlAddName = vacationQuery.addVacation(vacationId)
    // const
    await connection.execute(sql)
  } catch (error) { 
    console.log(error)
  }
}

const getVacations = async () => {
    try {
      const sql = vacationQuery.getFamilyGuests()
      const parameters = [id]
      const response = await connection.executeWithParameters(sql,parameters)
      return response
    } catch (error) { 
      console.log(error)
    }
}


module.exports = {
    addVacation,
    getVacations,
}