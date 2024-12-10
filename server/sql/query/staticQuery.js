const getMainGuests = (vacationId) => {
    return `SELECT hebrew_first_name,hebrew_last_name,english_first_name,english_last_name,is_main_user,user_id,family_id,
    phone_a,phone_b,email,identity_id FROM trip_tracker_${vacationId}.guest where is_main_user = 1;`
}
const getAllGuests = (vacationId) => {
    return `SELECT hebrew_first_name,hebrew_last_name,english_first_name,english_last_name,is_main_user,user_id,family_id,
    phone_a,phone_b,email,identity_id FROM trip_tracker_${vacationId}.guest;`
}

module.exports = {
    getMainGuests,
    getAllGuests
}