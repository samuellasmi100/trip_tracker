const addGuest = (userData,vacationId) =>{
  return `
  INSERT INTO trip_tracker_${vacationId}.guest(${Object.keys(userData)}) VALUES(${Object.values(userData).map(() => '?')})`;
}


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
gu.user_id,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM trip_tracker_${vacationId}.families fa join trip_tracker_${vacationId}.guest gu
on fa.family_id = gu.family_id where gu.family_id = ?`
}

const getFamilyMamber = (vacationId) => {
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
gu.flights_direction,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM trip_tracker_${vacationId}.families fa join trip_tracker_${vacationId}.guest gu
on fa.family_id = gu.family_id where gu.user_id= ?`
}

const getParentFamilyMamber = (vacationId) => {
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
gu.total_amount,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM trip_tracker_${vacationId}.families fa join trip_tracker_${vacationId}.guest gu
on fa.family_id = gu.family_id where gu.user_id= ?`
}

const updateGuest = (userData,id,vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.guest SET ${Object.keys(userData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE user_id = '${id}'`
}

const saveRegistrationForm = (vacationId) =>{
  return `INSERT INTO trip_tracker_${vacationId}.files (filename, fileType, filePath,family_id) VALUES (?, ?, ?,?)`;
}

module.exports ={
  updateGuest,
  addGuest,
  getFamilyGuests,
  getFamilyMamber,
  getParentFamilyMamber,
  saveRegistrationForm
}

