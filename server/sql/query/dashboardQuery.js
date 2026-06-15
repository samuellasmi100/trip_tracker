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

// Per-week (per-route) room utilization. Rooms are physical and reused every
// week, so the denominator (total numeric rooms) is constant across weeks — it
// is NOT computed here; the service attaches it from getOverallRoomUtilization.
//
// Weeks/routes live in the SHARED `trip_tracker.vacation_date` table; bookings
// live in the tenant `trip_tracker_<id>.room_taken` table. A single cross-DB
// LEFT JOIN attributes each booking to every week it OVERLAPS.
//
// Overlap (half-open, matching the hotel-turnover convention used by
// room_taken's own overlap probe in userRoomQuery): booking [bs,be) overlaps
// week [ws,we) iff  bs < we AND be > ws. With contiguous routes (week N's end
// == week N+1's start) a booking that sits cleanly inside one week is NOT
// double-counted at the seam, while a booking that genuinely spans two routes
// (חריגים) counts in BOTH. vacation_date dates are varchar — CAST to DATE so
// the comparison is chronological, not lexical; a malformed/empty value casts
// to NULL and simply fails the overlap (safe). Non-numeric room_ids (virtual
// rooms like 'קסה') are excluded, same as the rest of the dashboard. LEFT JOIN
// keeps weeks with zero bookings (0 occupied). Empty/null-dated routes (the
// "חריגים" row) are filtered out entirely.
const getRoomUtilizationByWeek = (vacationId) => `
  SELECT
    w.id                       AS week_id,
    w.name                     AS week_name,
    w.start_date               AS start_date,
    w.end_date                 AS end_date,
    COUNT(DISTINCT rt.room_id) AS occupied_rooms
  FROM trip_tracker.vacation_date w
  LEFT JOIN \`trip_tracker_${vacationId}\`.room_taken rt
    ON rt.room_id REGEXP '^[0-9]+'
   AND CAST(rt.start_date AS DATE) < CAST(w.end_date   AS DATE)
   AND CAST(rt.end_date   AS DATE) > CAST(w.start_date AS DATE)
  WHERE w.vacation_id = '${vacationId}'
    AND w.start_date IS NOT NULL AND w.start_date <> ''
    AND w.end_date   IS NOT NULL AND w.end_date   <> ''
  GROUP BY w.id, w.name, w.start_date, w.end_date
  ORDER BY CAST(w.start_date AS DATE), w.id
`;

// Corrected OVERALL room utilization (room ÷ room, NOT families ÷ rooms).
// occupied_rooms = distinct numeric rooms booked at any point in the vacation;
// total_rooms = the constant numeric room inventory (also the per-week
// denominator, attached to each week row by the service).
const getOverallRoomUtilization = (vacationId) => `
  SELECT
    (SELECT COUNT(*) FROM \`trip_tracker_${vacationId}\`.rooms
     WHERE rooms_id REGEXP '^[0-9]+')        AS total_rooms,
    COUNT(DISTINCT rt.room_id)               AS occupied_rooms
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

// Leads pipeline breakdown. The two followup_* counts split the app's existing
// "due" bucket (followup_date <= today AND open) into overdue vs today — open =
// is_active = 1 (registered/not_relevant flip it to 0); a NULL followup_date is
// "handled" and excluded. CURDATE() is the DB server's date.
const getLeadsSummary = (vacationId) => `
  SELECT
    COUNT(*) AS total,
    SUM(CASE WHEN status = 'follow_up'    THEN 1 ELSE 0 END) AS active,
    SUM(CASE WHEN status = 'registered'   THEN 1 ELSE 0 END) AS registered,
    SUM(CASE WHEN status = 'new_interest' THEN 1 ELSE 0 END) AS new_cold,
    SUM(CASE WHEN status = 'not_relevant' THEN 1 ELSE 0 END) AS not_relevant,
    SUM(CASE WHEN followup_date IS NOT NULL AND followup_date < CURDATE() AND is_active = 1 THEN 1 ELSE 0 END) AS followup_overdue,
    SUM(CASE WHEN followup_date IS NOT NULL AND followup_date = CURDATE() AND is_active = 1 THEN 1 ELSE 0 END) AS followup_today
  FROM \`trip_tracker_${vacationId}\`.leads
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
  getRoomUtilizationByWeek,
  getOverallRoomUtilization,
  getPaymentSummary,
  getFlightReadiness,
  getLeadsSummary,
  getCrossVacationFamilies,
};
