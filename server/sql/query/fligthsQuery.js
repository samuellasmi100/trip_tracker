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
    return `SELECT 
        f.validity_passport, 
        f.passport_number, 
        f.birth_date,
        f.age,
        f.outbound_flight_date, 
        f.return_flight_date,
        f.outbound_flight_number, 
        f.return_flight_number, 
        f.outbound_airline, 
        f.return_airline, 
        f.is_source_user, 
        f.user_classification, 
        g.arrival_date, 
        g.departure_date,
        CASE 
            WHEN f.validity_passport IS NULL 
                AND f.passport_number IS NULL 
                AND f.birth_date IS NULL 
                AND f.outbound_flight_date IS NULL 
                AND f.return_flight_date IS NULL 
                AND f.outbound_flight_number IS NULL 
                AND f.return_flight_number IS NULL 
                AND f.outbound_airline IS NULL 
                AND f.return_airline IS NULL 
                AND f.is_source_user IS NULL 
                AND f.user_classification IS NULL 
            THEN true
            ELSE false
        END AS all_flight_data_null
    FROM 
        trip_tracker_${vacationId}.flights f
    RIGHT JOIN 
        trip_tracker_${vacationId}.guest g
    ON 
        f.user_id = g.user_id
    WHERE 
        g.user_id = ?;`
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