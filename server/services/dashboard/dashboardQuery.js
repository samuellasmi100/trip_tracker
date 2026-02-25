'use strict';

const getFamiliesAndGuests = (vacationId) => `
  SELECT
    COUNT(*)                                           AS total_families,
    COALESCE(SUM(CAST(number_of_guests AS SIGNED)), 0) AS total_guests
  FROM \`trip_tracker_${vacationId}\`.families
`;

const getRoomOccupancy = (vacationId) => `
  SELECT
    (SELECT COUNT(*) FROM \`trip_tracker_${vacationId}\`.rooms
     WHERE rooms_id REGEXP '^[0-9]+')        AS total_rooms,
    (SELECT COUNT(*) FROM \`trip_tracker_${vacationId}\`.families) AS total_families,
    COUNT(DISTINCT rt.family_id)              AS occupied_families
  FROM \`trip_tracker_${vacationId}\`.room_taken rt
  WHERE rt.room_id REGEXP '^[0-9]+'
`;

// Financial: expected income (families.total_amount) vs actually collected (payments)
const getPaymentSummary = (vacationId) => `
  SELECT
    COALESCE(SUM(
      CASE WHEN f.total_amount IS NOT NULL AND f.total_amount != '' AND f.total_amount != '0'
      THEN CAST(REPLACE(REPLACE(f.total_amount, ',', ''), ' ', '') AS DECIMAL(14,2))
      ELSE 0 END
    ), 0) AS total_expected,
    COALESCE(
      (SELECT SUM(amount) FROM \`trip_tracker_${vacationId}\`.payments WHERE status = 'completed'),
    0) AS total_paid
  FROM \`trip_tracker_${vacationId}\`.families f
`;

// Per-guest flight readiness — passport, birthdate, outbound, return, fully ready
const getFlightReadiness = (vacationId) => `
  SELECT
    (SELECT COUNT(*) FROM \`trip_tracker_${vacationId}\`.guest) AS total_guests_in_system,
    COUNT(*)  AS guests_with_record,
    SUM(CASE WHEN passport_number    IS NOT NULL AND passport_number    != '' THEN 1 ELSE 0 END) AS with_passport,
    SUM(CASE WHEN birth_date         IS NOT NULL AND birth_date         != '' THEN 1 ELSE 0 END) AS with_birthdate,
    SUM(CASE WHEN outbound_flight_number IS NOT NULL AND outbound_flight_number != '' THEN 1 ELSE 0 END) AS with_outbound,
    SUM(CASE WHEN return_flight_number   IS NOT NULL AND return_flight_number   != '' THEN 1 ELSE 0 END) AS with_return,
    SUM(CASE
      WHEN passport_number        IS NOT NULL AND passport_number        != ''
       AND birth_date             IS NOT NULL AND birth_date             != ''
       AND outbound_flight_number IS NOT NULL AND outbound_flight_number != ''
       AND return_flight_number   IS NOT NULL AND return_flight_number   != ''
      THEN 1 ELSE 0 END) AS fully_ready
  FROM \`trip_tracker_${vacationId}\`.flights
`;

// Leads pipeline breakdown
const getLeadsSummary = (vacationId) => `
  SELECT
    COUNT(*) AS total,
    SUM(CASE WHEN status IN ('follow_up','meeting_scheduled','interested') THEN 1 ELSE 0 END) AS active,
    SUM(CASE WHEN status = 'registered'                                   THEN 1 ELSE 0 END) AS registered,
    SUM(CASE WHEN status IN ('new_interest','no_answer')                  THEN 1 ELSE 0 END) AS new_cold,
    SUM(CASE WHEN status = 'not_relevant'                                 THEN 1 ELSE 0 END) AS not_relevant
  FROM \`trip_tracker_${vacationId}\`.leads
`;

// Booking form submissions — how many families submitted the public form
const getBookingStatus = (vacationId) => `
  SELECT
    (SELECT COUNT(*) FROM \`trip_tracker_${vacationId}\`.families)                    AS total_families,
    COUNT(DISTINCT bs.family_id)                                                       AS submitted
  FROM \`trip_tracker_${vacationId}\`.booking_submissions bs
`;

// Cross-vacation: families whose name appears in 2+ of the given vacation schemas.
// vacationIds is an array — we build a UNION ALL dynamically.
const getCrossVacationFamilies = (vacationIds) => {
  const unionParts = vacationIds
    .map((id) => `SELECT family_name, '${id}' AS vacation_id FROM \`trip_tracker_${id}\`.families`)
    .join('\nUNION ALL\n');
  return `
    SELECT
      family_name,
      COUNT(DISTINCT vacation_id)                                  AS vacation_count,
      GROUP_CONCAT(vacation_id ORDER BY vacation_id SEPARATOR ',') AS vacation_ids
    FROM (${unionParts}) combined
    GROUP BY family_name
    HAVING vacation_count > 1
    ORDER BY vacation_count DESC, family_name
    LIMIT 100
  `;
};

module.exports = {
  getFamiliesAndGuests,
  getRoomOccupancy,
  getPaymentSummary,
  getFlightReadiness,
  getLeadsSummary,
  getBookingStatus,
  getCrossVacationFamilies,
};
