const getMainGuests = (vacationId) => {
    return `SELECT hebrew_first_name,hebrew_last_name,english_first_name,english_last_name,is_main_user,user_id,family_id,age,birth_date,
    phone_a,phone_b,email,identity_id FROM trip_tracker_${vacationId}.guest where is_main_user = 1;`
}
const getAllGuests = (vacationId) => {
    return `SELECT hebrew_first_name,hebrew_last_name,english_first_name,english_last_name,is_main_user,user_id,family_id,age,
    birth_date,phone_a,phone_b,email,identity_id FROM trip_tracker_${vacationId}.guest;`
}
const getFlightsDetails = (vacationId) => {
    return `SELECT 
    f.validity_passport, 
    f.passport_number, 
    f.birth_date,
    f.outbound_flight_date, 
    f.return_flight_date,
    f.outbound_flight_number, 
    f.return_flight_number, 
    f.outbound_airline, 
    f.return_airline, 
    f.is_source_user, 
    f.user_classification, 
    f.age,
    g.hebrew_first_name,
    g.hebrew_last_name,
    g.english_first_name,
    g.english_last_name,
    g.is_main_user,
    g.identity_id,
    g.flights,
    g.flying_with_us,
    g.flights_direction,
    g.age as default_age
FROM 
    trip_tracker_${vacationId}.flights f
right JOIN 
    trip_tracker_${vacationId}.guest g
ON 
    f.user_id = g.user_id
`
}
module.exports = {
    getMainGuests,
    getAllGuests,
    getFlightsDetails
}