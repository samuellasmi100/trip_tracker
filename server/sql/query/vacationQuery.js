const addVacation = () => {
  return `INSERT INTO vacations (name,vacation_id) VALUES (?,?)`;
};
const addVacationDates = (dateEntries) => {
  const valuesPlaceholders = dateEntries.map(() => `(?, ?, ?)`).join(", ");
  return `INSERT INTO vacation_date (vacation_id,start_date, end_date) VALUES ${valuesPlaceholders}`;
};
const createDbForVacation = (vacationId) => {
  return `CREATE SCHEMA \`trip_tracker_${vacationId}\``;
};

const getVacations = () => {
  return `SELECT v.name,v.vacation_id,vd.start_date,vd.end_date FROM vacations v
join vacation_date vd on v.vacation_id = vd.vacation_id;`
}

module.exports = {
  addVacation,
  addVacationDates,
  createDbForVacation,
  getVacations
};
