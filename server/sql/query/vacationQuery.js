const addVacation = () => {
  return `INSERT INTO trip_tracker.vacations (name,vacation_id) VALUES (?,?)`;
};

const addVacationDates = () => {
  return `INSERT INTO trip_tracker.vacation_date (vacation_id,start_date,end_date,name) VALUES(?,?,?,?)`;
};
const getVacations = () => {
  return `SELECT name,vacation_id FROM trip_tracker.vacations`
}
const getVacationDates = () => {
  return `SELECT name,vacation_id,start_date,end_date FROM trip_tracker.vacation_date where vacation_id = ?`;
};

module.exports = {
  addVacation,
  addVacationDates,
  getVacations,
  getVacationDates
};
