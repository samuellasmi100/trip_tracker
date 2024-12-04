const connection = require("../../db/connection-wrapper");
const vacationQuery = require("../../sql/query/vacationQuery")
const {
  dropTablesQueries,
  createFamilyTableQuery,
  createFamilyRoomTableQuery,
  createFileTableQuery,
  createFightsTableQuery,
  createGuestTableQuery,
  createNotesTableQuery,
  createPaymentsTableQuery,
  createRoomsTableQuery,
  createUserRoomAssignmentsTableQuery,
  insertRoomsDataQuery,
} = require("../../sql/query/trip_tracker_dump")

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
    const sqlAddNameParameters = [vacationId,vacationDetails.vacation_name]
    const sqlAddDates = vacationQuery.addVacationDates(dateEntries)
    const sqlAddDatesParameters = dateEntries.flat();
    const sqlCreateDb = vacationQuery.createDbForVacation(vacationId)
    
    await connection.executeWithParameters(sqlAddName,sqlAddNameParameters)
    await connection.executeWithParameters(sqlAddDates,sqlAddDatesParameters)
    const response = await connection.execute(sqlCreateDb)
    if(response.serverStatus == 2){

    }
    console.log(response.serverStatus)
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