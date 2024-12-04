const connection = require("../../db/connection-wrapper");
const vacationQuery = require("../../sql/query/vacationQuery")
const createDatabaseAndTable = require("../../sql/utils/createDb")

const addVacation = async (vacationId,vacationDetails) => {
  const dateEntries = [];
  Object.keys(vacationDetails).forEach((key) => {
      if (key.startsWith("start_date")) {
          const index = key.split("_")[2];
          const start_date = vacationDetails[`start_date_${index}`];
          const end_date = vacationDetails[`end_date_${index}`];
          dateEntries.push([vacationId, start_date, end_date]);
      }
  });
  try {
    const sqlAddName = vacationQuery.addVacation()
    const sqlAddNameParameters = [vacationDetails.vacation_name,vacationId]
    const sqlAddDates = vacationQuery.addVacationDates(dateEntries)
    const sqlAddDatesParameters = dateEntries.flat();

    
    await connection.executeWithParameters(sqlAddName,sqlAddNameParameters)
    await connection.executeWithParameters(sqlAddDates,sqlAddDatesParameters)
    await createDatabaseAndTable(vacationId)
    
  } catch (error) { 
    console.log(error)
  }
}

const getVacations = async () => {
    try {
      const sql = vacationQuery.getVacations()
      console.log(sql)
      const response = await connection.execute(sql)
      return response
    } catch (error) { 
      console.log(error)
    }
}


module.exports = {
    addVacation,
    getVacations,
}