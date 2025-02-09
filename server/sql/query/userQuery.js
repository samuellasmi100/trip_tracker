const addGuest = (userData, vacationId) => {
  return `
  INSERT INTO trip_tracker_${vacationId}.guest(${Object.keys(
    userData
  )}) VALUES(${Object.values(userData).map(() => "?")})`;
};

const getFamilyGuests = (vacationId) => {
  return `SELECT fa.family_id,fa.family_name,
gu.hebrew_first_name,gu.hebrew_last_name,
gu.english_first_name,gu.english_last_name,
gu.flights,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.number_of_guests,
gu.number_of_rooms,
gu.total_amount,
gu.flights_direction,
gu.week_chosen,
gu.date_chosen,
gu.age,
gu.birth_date,
gu.flying_with_us,
gu.number_of_payments,
gu.user_id,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM trip_tracker_${vacationId}.families fa join trip_tracker_${vacationId}.guest gu
on fa.family_id = gu.family_id where gu.family_id = ?`;
};

const getFamilyMember = (vacationId) => {
  return `SELECT fa.family_id,fa.family_name,
gu.hebrew_first_name,gu.hebrew_last_name,
gu.english_first_name,gu.english_last_name,
gu.flights,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.week_chosen,
gu.date_chosen,
gu.age,
gu.birth_date,
gu.flying_with_us,
gu.flights_direction,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM trip_tracker_${vacationId}.families fa join trip_tracker_${vacationId}.guest gu
on fa.family_id = gu.family_id where gu.user_id= ?`;
};

const getParentFamilyMember = (vacationId) => {
  return `SELECT fa.family_id,fa.family_name,
gu.hebrew_first_name,gu.hebrew_last_name,
gu.english_first_name,gu.english_last_name,
gu.flights,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.flights_direction,
gu.week_chosen,
gu.date_chosen,
gu.age,
gu.birth_date,
gu.flying_with_us,
gu.total_amount,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM trip_tracker_${vacationId}.families fa join trip_tracker_${vacationId}.guest gu
on fa.family_id = gu.family_id where gu.user_id= ?`;
};

const updateGuest = (userData, id, vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.guest SET ${Object.keys(userData)
    .map((key) => `${key}=?`)
    .join(",")}
  WHERE user_id = '${id}'`;
};

const saveRegistrationForm = (vacationId) => {
  return `INSERT INTO trip_tracker_${vacationId}.files (filename, fileType, filePath,family_id) VALUES (?, ?, ?,?)`;
};

const deleteGuest = (vacationId) => {
  return `
DELETE FROM trip_tracker_${vacationId}.guest WHERE user_id = ?;
`;
};
const deleteGuestFlights = (vacationId) => {
  return `
DELETE FROM trip_tracker_${vacationId}.flights WHERE user_id = ?;`;
};
const deleteGuestRooms = (vacationId) => {
  return `

DELETE FROM trip_tracker_${vacationId}.user_room_assignments WHERE user_id = ?;`;
};
const deleteNotes = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.notes WHERE user_id = ?;`;
};
const deleteFamilyGuests = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.guest WHERE family_id = ?;`;
};
const deleteFamilyFlights = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.flights WHERE family_id = ?;`;
};
const deleteFamilyRooms = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.room_taken WHERE family_id = ?;`;
};
const deleteFamilyGuestRooms = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.user_room_assignments WHERE family_id = ?;`;
};
const deleteFamilyNotes = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.notes WHERE family_id = ?;`;
};
const deleteFamilyPayments = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.payments WHERE family_id = ?;`;
};
const deleteFamily = (vacationId) => {
  return `DELETE FROM trip_tracker_${vacationId}.families WHERE family_id = ?;`;
};

module.exports = {
  updateGuest,
  addGuest,
  getFamilyGuests,
  getFamilyMember,
  getParentFamilyMember,
  saveRegistrationForm,
  deleteGuest,
  deleteGuestFlights,
  deleteGuestRooms,
  deleteNotes,
  deleteFamilyGuests,
  deleteFamilyFlights,
  deleteFamilyRooms,
  deleteFamilyGuestRooms,
  deleteFamilyNotes,
  deleteFamilyPayments,
  deleteFamily,
};
