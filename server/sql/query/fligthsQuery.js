const addFlightsDetails = (flightsData,vacationId) => {
    return `INSERT INTO trip_tracker_${vacationId}.flights (${Object.keys(flightsData)}) values (${Object.values(flightsData).map(() => '?')})`
}

const updateFlightsDetails = (flightsData,id,vacationId) => {
    return `UPDATE trip_tracker_${vacationId}.flights SET ${Object.keys(flightsData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE user_id = '${id}'`
}

const getFlightsDetails = (vacationId) => {
    return `SELECT validity_passport,passport_number ,birth_date ,
   outbound_flight_date,return_flight_date ,
   outbound_flight_number,return_flight_number,age,outbound_airline,return_airline,is_source_user FROM trip_tracker_${vacationId}.flights where user_id = ?;`
}

const getFlightsByFamily = (vacationId) => {
  return `SELECT * FROM trip_tracker_${vacationId}.flights where family_id = ? AND is_source_user = 1;`
}



module.exports = {
    addFlightsDetails,
    updateFlightsDetails,
    getFlightsDetails,
    getFlightsByFamily
}