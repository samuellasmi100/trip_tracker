const addFlightsDetails = (flightsData) => {
    return `INSERT INTO flights (${Object.keys(flightsData)}) values (${Object.values(flightsData).map(() => '?')})`
}

const updateFlightsDetails = (flightsData,id) => {
    return `UPDATE flights SET ${Object.keys(flightsData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE user_id = '${id}'`
}

const getFlightsDetails = () => {
    return `SELECT validity_passport,passport_number ,birth_date ,
   outbound_flight_date,return_flight_date ,
   outbound_flight_number,return_flight_number,age,outbound_airline,return_airline,is_source_user FROM flights where user_id = ?;`
}

const getFlightsByFamily = () => {
  return `SELECT * FROM flights where family_id = ? AND is_source_user = 1;`
}



module.exports = {
    addFlightsDetails,
    updateFlightsDetails,
    getFlightsDetails,
    getFlightsByFamily
}