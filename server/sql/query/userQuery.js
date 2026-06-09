const addGuest = (userData, vacationId) => {
  return `
  INSERT INTO trip_tracker_${vacationId}.guest(${Object.keys(
    userData
  )}) VALUES(${Object.values(userData).map(() => "?")})`;
};

const getFamilyGuests = (vacationId) => {
  return `
SELECT fa.family_id,fa.family_name,urs.room_id,
gu.hebrew_first_name,gu.hebrew_last_name,
gu.english_first_name,gu.english_last_name,
gu.flights,
gu.phone,
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
gu.number_of_payments,
gu.user_id,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address,
f.passport_number,
f.validity_passport,
f.user_classification,
f.outbound_flight_number,
f.outbound_airline,
f.outbound_flight_date,
f.return_flight_number,
f.return_airline,
f.return_flight_date
FROM trip_tracker_${vacationId}.families fa
join trip_tracker_${vacationId}.guest gu on fa.family_id = gu.family_id
left join trip_tracker_${vacationId}.user_room_assignments urs on urs.user_id = gu.user_id
left join (
  select fl.* from trip_tracker_${vacationId}.flights fl
  join (select user_id, max(id) as max_id from trip_tracker_${vacationId}.flights group by user_id) m
    on fl.id = m.max_id
) f on f.user_id = gu.user_id
where gu.family_id = ?`;
};

const getFamilyMember = (vacationId) => {
  return `SELECT fa.family_id,fa.family_name,
gu.hebrew_first_name,gu.hebrew_last_name,
gu.english_first_name,gu.english_last_name,
gu.flights,
gu.phone,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.week_chosen,
gu.date_chosen,
gu.age,
gu.birth_date,
gu.total_amount,
gu.flights_direction,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM trip_tracker_${vacationId}.families fa join trip_tracker_${vacationId}.guest gu
on fa.family_id = gu.family_id where gu.user_id= ?`;
};

const getParentFamilyMember = (vacationId) => {
  return `SELECT fa.family_id,fa.family_name,
gu.hebrew_first_name,gu.hebrew_last_name,
gu.english_first_name,gu.english_last_name,
gu.flights,
gu.phone,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.flights_direction,
gu.week_chosen,
gu.date_chosen,
gu.age,
gu.birth_date,
gu.total_amount,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM trip_tracker_${vacationId}.families fa join trip_tracker_${vacationId}.guest gu
on fa.family_id = gu.family_id where gu.user_id= ?`;
};

const updateGuest = (userData, id, vacationId) => {
  // Strip fields that getFamilyGuests JOINs in for display but that don't live on
  // the guest table — writing them here would be an "Unknown column" error.
  // room_id comes from user_room_assignments; the flight fields from the flights
  // table (their own edit flow saves them via the flights endpoints).
  delete userData.room_id
  delete userData.passport_number
  delete userData.validity_passport
  delete userData.user_classification
  delete userData.outbound_flight_number
  delete userData.outbound_airline
  delete userData.outbound_flight_date
  delete userData.return_flight_number
  delete userData.return_airline
  delete userData.return_flight_date
  return `UPDATE trip_tracker_${vacationId}.guest SET ${Object.keys(userData)
    .map((key) => `${key}=?`)
    .join(",")}
  WHERE user_id = '${id}'`;
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

// Demotes every other guest in the family — used inside the same transaction
// as an addGuest INSERT or an updateGuest UPDATE that's setting is_main_user=1.
// The user_id <> ? exclusion is a no-op for the add case (the new row doesn't
// exist yet) and protects the row being updated in the update case.
const clearOtherMainUsers = (vacationId) =>
  `UPDATE trip_tracker_${vacationId}.guest
   SET is_main_user = 0
   WHERE family_id = ? AND user_id <> ?`;

// Family headcount limit + how many guests currently exist. limit_size is the
// intended size set at family creation (families.number_of_guests, may be NULL =
// no limit); current_count counts ALL guests in the family (incl. the main user).
const getFamilyCapacity = (vacationId) =>
  `SELECT
     (SELECT number_of_guests FROM trip_tracker_${vacationId}.families WHERE family_id = ?) AS limit_size,
     (SELECT COUNT(*) FROM trip_tracker_${vacationId}.guest WHERE family_id = ?) AS current_count`;

module.exports = {
  updateGuest,
  addGuest,
  getFamilyCapacity,
  clearOtherMainUsers,
  getFamilyGuests,
  getFamilyMember,
  getParentFamilyMember,
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
