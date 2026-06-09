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

// Returns all family members who have at least some flight data, with their names
const getFamilyFlightsWithNames = (vacationId) => {
  return `SELECT
      f.user_id,
      f.outbound_flight_date,
      f.outbound_flight_number,
      f.outbound_airline,
      f.return_flight_date,
      f.return_flight_number,
      f.return_airline,
      f.user_classification,
      g.hebrew_first_name,
      g.hebrew_last_name
    FROM trip_tracker_${vacationId}.flights f
    JOIN trip_tracker_${vacationId}.guest g ON f.user_id = g.user_id
    WHERE f.family_id = ?
      AND (
        f.outbound_flight_number IS NOT NULL OR
        f.return_flight_number   IS NOT NULL OR
        f.outbound_airline       IS NOT NULL
      )`;
}

// ── Group-flights bulk apply ─────────────────────────────────────────────────
// Latest flight row (MAX(id)) per user for the given user_ids — the same "latest
// row" getFamilyGuests joins. Used to MERGE existing legs with the modal's legs
// (Option B) before writing, so an unfilled direction is never wiped. The IN
// list is expanded to one placeholder per id (db.execute can't expand arrays).
const getLatestFlightsByUserIds = (userIds, vacationId) => {
  const placeholders = userIds.map(() => "?").join(",");
  return `SELECT fl.user_id,
                 fl.outbound_flight_date, fl.outbound_flight_number, fl.outbound_airline,
                 fl.return_flight_date,   fl.return_flight_number,   fl.return_airline,
                 fl.passport_number,      fl.validity_passport
          FROM trip_tracker_${vacationId}.flights fl
          JOIN (
            SELECT user_id, MAX(id) AS max_id
            FROM trip_tracker_${vacationId}.flights
            WHERE user_id IN (${placeholders})
            GROUP BY user_id
          ) m ON fl.id = m.max_id`;
};

// Generic column setter for a user's flight row: SETs exactly the keys passed in
// `legData` (merged legs, and/or the per-person passport columns) WHERE user_id.
// Columns NOT passed (e.g. classification, seat) are never in the SET → untouched.
// userId is appended as the WHERE param by the caller.
const updateFlightLegs = (legData, vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.flights
          SET ${Object.keys(legData).map((k) => `${k}=?`).join(",")}
          WHERE user_id = ?`;
};

// Flip the guest's "כולל טיסות" flag on + set the per-person direction (chosen
// in the modal). No dates in the SET, so userService's room-lock 409 guard
// (which only fires on arrival/departure changes) is never reached.
const setGuestFlyingFlag = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.guest
          SET flights = 1, flights_direction = ?
          WHERE user_id = ?`;
};

// Mark a guest as NOT flying. Only the flag is cleared — direction and any
// existing leg rows are left untouched (Option B: never wipe), so flipping them
// back on later doesn't lose data. No dates → no 409 guard.
const setGuestNotFlying = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.guest
          SET flights = 0
          WHERE user_id = ?`;
};

module.exports = {
    addFlightsDetails,
    updateFlightsDetails,
    getFlightsDetails,
    getFlightsByFamily,
    getFamilyFlightsWithNames,
    getLatestFlightsByUserIds,
    updateFlightLegs,
    setGuestFlyingFlag,
    setGuestNotFlying,
}