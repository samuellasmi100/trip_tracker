const vacationDb = require("./vacationDb")

const addVacation = async (vacationDetails,vacationId) => {
    const dateEntries = [];
    Object.keys(vacationDetails).forEach((key) => {
      if (key.startsWith("start_date")) {
        const index = key.split("_")[2]; 
        const start_date = vacationDetails[`start_date_${index}`];
        const end_date = vacationDetails[`end_date_${index}`];
    
        dateEntries.push({
          vacation_id:vacationId,
          start_date,
          end_date,
          name: `שבוע ${parseInt(index, 10) + 1}`,
        });
      }
    });
    if (vacationDetails.exceptions === "on") {
      dateEntries.push({
        vacation_id:vacationId,
        start_date: "",
        end_date: "",
        name: "חריגים",
      });
    }

     await vacationDb.addVacation(vacationDetails,vacationId)
     await Promise.all(dateEntries?.map((vac) => vacationDb.addVacationDates(vacationId,vac.start_date,vac.end_date,vac.name)));
}

const getVacations = async () => {
    return await vacationDb.getVacations()
}
const getVacationDates = async () => {
  return await vacationDb.getVacationDates()
}
module.exports = {
    addVacation,
    getVacations,
    getVacationDates
}