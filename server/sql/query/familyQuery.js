const addFamily = (vacationId) =>{
    return `INSERT INTO trip_tracker_${vacationId}.families (family_name, family_id, number_of_guests, number_of_rooms, total_amount, start_date, end_date, doc_token) VALUES (?,?,?,?,?,?,?,UUID())`
  }

  const getFamilies = (vacationId) =>{
  return `
SELECT
    fa.family_id,
    fa.family_name,
    gu.hebrew_first_name,
    gu.hebrew_last_name,
    gu.english_last_name,
    fa.number_of_guests,
    fa.number_of_rooms,
    REPLACE(fa.total_amount, ',', '') AS total_amount,
    fa.start_date,
    fa.end_date,
    COALESCE(pay_agg.total_paid_amount, 0) AS total_paid_amount,
    rt_agg.room_ids,
    (SELECT COUNT(*)
     FROM trip_tracker_${vacationId}.guest
     WHERE family_id = fa.family_id) AS user_in_system_count
FROM trip_tracker_${vacationId}.families fa
LEFT JOIN trip_tracker_${vacationId}.guest gu
    ON fa.family_id = gu.family_id AND gu.is_main_user = 1
LEFT JOIN (
    SELECT family_id, SUM(amount) AS total_paid_amount
    FROM trip_tracker_${vacationId}.payments
    WHERE status = 'completed'
    GROUP BY family_id
) pay_agg ON fa.family_id = pay_agg.family_id
LEFT JOIN (
    SELECT family_id, GROUP_CONCAT(room_id ORDER BY room_id) AS room_ids
    FROM trip_tracker_${vacationId}.room_taken
    GROUP BY family_id
) rt_agg ON fa.family_id = rt_agg.family_id
`
  }

  const updateFamily = (vacationId) => {
    return `UPDATE trip_tracker_${vacationId}.families SET family_name = ?, number_of_guests = ?, number_of_rooms = ?, total_amount = ?, start_date = ?, end_date = ? WHERE family_id = ?`
  }

  // Server-side family search by name (used by room board assignment dialog)
  const searchFamilies = (vacationId) => {
    return `SELECT
        fa.family_id,
        fa.family_name,
        fa.start_date,
        fa.end_date,
        fa.number_of_rooms
      FROM trip_tracker_${vacationId}.families fa
      WHERE fa.family_name LIKE ?
      ORDER BY fa.family_name
      LIMIT 15`;
  };

  module.exports ={
    addFamily,
    getFamilies,
    updateFamily,
    searchFamilies,
  }
