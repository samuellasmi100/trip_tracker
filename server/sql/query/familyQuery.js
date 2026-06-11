const PAGE_SIZE = 30;

// `withCreatedAt` is used ONLY by the Excel family-import flow, which carries a
// backdated registration date. The manual UI flow omits it so MySQL's
// DEFAULT CURRENT_TIMESTAMP applies (the registration timestamp = now).
const addFamily = (vacationId, { withCreatedAt = false } = {}) =>{
  const columns = [
    'family_name', 'family_id', 'number_of_guests', 'number_of_babies',
    'number_of_rooms', 'total_amount', 'total_amount_eur', 'start_date', 'end_date',
    'payment_method', 'num_payments', 'special_requests',
  ];
  const placeholders = columns.map(() => '?');
  // doc_token is always generated server-side.
  columns.push('doc_token');
  placeholders.push('UUID()');
  if (withCreatedAt) {
    columns.push('created_at');
    placeholders.push('?');
  }
  return `INSERT INTO trip_tracker_${vacationId}.families (${columns.join(', ')}) VALUES (${placeholders.join(',')})`
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
    fa.number_of_babies,
    fa.special_requests,
    fa.number_of_rooms,
    REPLACE(fa.total_amount, ',', '') AS total_amount,
    fa.payment_method,
    fa.num_payments,
    fa.start_date,
    fa.end_date,
    fa.created_at,
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
-- Exactly one main-user row per family. A plain join on is_main_user = 1 would
-- fan the family out into duplicate rows if it ever had two mains; pin to the
-- highest-id main user (same MAX(id)-per-group pattern the flights query uses).
LEFT JOIN (
    SELECT g.family_id, g.hebrew_first_name, g.hebrew_last_name, g.english_last_name
    FROM trip_tracker_${vacationId}.guest g
    JOIN (
        SELECT family_id, MAX(id) AS max_id
        FROM trip_tracker_${vacationId}.guest
        WHERE is_main_user = 1
        GROUP BY family_id
    ) mu ON mu.max_id = g.id
) gu ON fa.family_id = gu.family_id
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
-- Insertion order: oldest-added first (#1 = first family added). created_at was
-- backfilled to the migration time for all pre-existing rows, so those share a
-- timestamp — fall back to the primary key id to keep the order deterministic.
-- New families get distinct created_at values and sort correctly on their own.
ORDER BY fa.created_at ASC, fa.id ASC
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
  return `UPDATE trip_tracker_${vacationId}.families SET family_name = ?, number_of_guests = ?, number_of_babies = ?, special_requests = ?, number_of_rooms = ?, total_amount = ?, start_date = ?, end_date = ?, payment_method = ?, num_payments = ? WHERE family_id = ?`
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
