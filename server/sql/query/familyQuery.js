const PAGE_SIZE = 30;

const addFamily = (vacationId) =>{
  return `INSERT INTO trip_tracker_${vacationId}.families (family_name, family_id, number_of_guests, number_of_rooms, total_amount, start_date, end_date, payment_method, num_payments, doc_token) VALUES (?,?,?,?,?,?,?,?,?,UUID())`
}

const getFamilies = (vacationId, { search = '', limit = PAGE_SIZE, offset = 0 } = {}) => {
  const whereClause = search ? `WHERE fa.family_name LIKE ?` : '';
  // LIMIT and OFFSET are trusted integers computed server-side — embed directly to avoid
  // MySQL2 prepared-statement type errors with ? placeholders for LIMIT/OFFSET
  return `
SELECT
    fa.family_id,
    fa.family_name,
    fa.doc_token,
    gu.hebrew_first_name,
    gu.hebrew_last_name,
    gu.english_last_name,
    fa.number_of_guests,
    fa.number_of_rooms,
    REPLACE(fa.total_amount, ',', '') AS total_amount,
    fa.payment_method,
    fa.num_payments,
    fa.start_date,
    fa.end_date,
    COALESCE(pay_agg.total_paid_amount, 0) AS total_paid_amount,
    rt_agg.room_ids,
    (SELECT COUNT(*)
     FROM trip_tracker_${vacationId}.guest
     WHERE family_id = fa.family_id) AS user_in_system_count,
    -- Registration status (signed wins over pending; pending requires non-expired):
    CASE
      WHEN reg_agg.has_signed = 1         THEN 'signed'
      WHEN reg_agg.has_pending_active = 1 THEN 'pending'
      ELSE NULL
    END AS registration_status,
    reg_agg.signed_at AS registration_signed_at
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
LEFT JOIN (
    SELECT
      family_id,
      MAX(CASE WHEN status = 'signed' THEN 1 ELSE 0 END)                            AS has_signed,
      MAX(CASE WHEN status = 'signed' THEN signed_at END)                           AS signed_at,
      MAX(CASE WHEN status = 'pending' AND expires_at > NOW() THEN 1 ELSE 0 END)    AS has_pending_active
    FROM trip_tracker_${vacationId}.registration_requests
    GROUP BY family_id
) reg_agg ON fa.family_id = reg_agg.family_id
${whereClause}
ORDER BY fa.family_name
LIMIT ${limit} OFFSET ${offset}`;
};

const countFamilies = (vacationId, { search = '' } = {}) => {
  const whereClause = search ? `WHERE family_name LIKE ?` : '';
  return `SELECT COUNT(*) AS total FROM trip_tracker_${vacationId}.families ${whereClause}`;
};

const getStats = (vacationId) => `
SELECT
  COUNT(*) AS family_count,
  COALESCE(SUM(CAST(fa.number_of_guests AS SIGNED)), 0) AS total_guests,
  COALESCE(SUM(
    GREATEST(
      CAST(COALESCE(fa.number_of_guests, 0) AS SIGNED) - CAST(COALESCE(gu_count.guest_count, 0) AS SIGNED),
      0
    )
  ), 0) AS total_missing,
  COALESCE(SUM(
    CASE
      WHEN fa.total_amount IS NOT NULL AND fa.total_amount != ''
      THEN CAST(REPLACE(fa.total_amount, ',', '') AS DECIMAL(12,2)) - COALESCE(pay_agg.total_paid_amount, 0)
      ELSE 0
    END
  ), 0) AS total_balance
FROM trip_tracker_${vacationId}.families fa
LEFT JOIN (
  SELECT family_id, SUM(amount) AS total_paid_amount
  FROM trip_tracker_${vacationId}.payments
  WHERE status = 'completed'
  GROUP BY family_id
) pay_agg ON fa.family_id = pay_agg.family_id
LEFT JOIN (
  SELECT family_id, COUNT(*) AS guest_count
  FROM trip_tracker_${vacationId}.guest
  GROUP BY family_id
) gu_count ON fa.family_id = gu_count.family_id`;

const updateFamily = (vacationId) => {
  return `UPDATE trip_tracker_${vacationId}.families SET family_name = ?, number_of_guests = ?, number_of_rooms = ?, total_amount = ?, start_date = ?, end_date = ?, payment_method = ?, num_payments = ? WHERE family_id = ?`
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

module.exports = {
  PAGE_SIZE,
  addFamily,
  getFamilies,
  countFamilies,
  getStats,
  updateFamily,
  searchFamilies,
}
