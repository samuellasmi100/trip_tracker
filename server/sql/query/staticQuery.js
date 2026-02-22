const getMainGuests = (vacationId, limit, offset) => {
    return `SELECT
    fa.family_id,
    fa.family_name,
    fa.number_of_guests,
    fa.total_amount,
    fa.start_date,
    fa.end_date,
    g.phone_a,
    g.email,
    g.identity_id,
    g.user_id,
    (SELECT COUNT(*)
     FROM trip_tracker_${vacationId}.guest ig
     WHERE ig.family_id = fa.family_id) AS user_in_system_count
FROM
    trip_tracker_${vacationId}.families fa
LEFT JOIN (
    SELECT
        family_id,
        COALESCE(MAX(CASE WHEN is_main_user = 1 THEN phone_a END), MAX(phone_a))       AS phone_a,
        COALESCE(MAX(CASE WHEN is_main_user = 1 THEN email END), MAX(email))           AS email,
        COALESCE(MAX(CASE WHEN is_main_user = 1 THEN identity_id END), MAX(identity_id)) AS identity_id,
        COALESCE(MAX(CASE WHEN is_main_user = 1 THEN user_id END), MAX(user_id))       AS user_id
    FROM trip_tracker_${vacationId}.guest
    GROUP BY family_id
) g ON fa.family_id = g.family_id
WHERE
    (? = '' OR fa.family_name LIKE CONCAT('%',?,'%')
            OR g.phone_a      LIKE CONCAT('%',?,'%')
            OR g.email        LIKE CONCAT('%',?,'%'))
ORDER BY fa.family_name
LIMIT ${limit} OFFSET ${offset}`
}

const getAllGuests = (vacationId, limit, offset) => {
    return `SELECT gu.hebrew_first_name, gu.hebrew_last_name, gu.english_first_name, gu.english_last_name,
    gu.is_main_user, gu.user_id, gu.family_id, gu.age,
    gu.birth_date, gu.phone_a, gu.phone_b, gu.email, gu.identity_id, ura.room_id
    FROM trip_tracker_${vacationId}.guest gu
    LEFT JOIN trip_tracker_${vacationId}.user_room_assignments ura ON gu.user_id = ura.user_id
    WHERE (? = '' OR gu.hebrew_first_name LIKE CONCAT('%',?,'%')
                  OR gu.hebrew_last_name  LIKE CONCAT('%',?,'%')
                  OR gu.identity_id       LIKE CONCAT('%',?,'%'))
    ORDER BY gu.hebrew_last_name, gu.hebrew_first_name
    LIMIT ${limit} OFFSET ${offset}`
}

const getFlightsDetails = (vacationId) => {
    return `SELECT 
    f.passport_number, 
    DATE_FORMAT(f.validity_passport, '%d/%m/%Y') AS validity_passport, 
    DATE_FORMAT(f.birth_date, '%d/%m/%Y') AS birth_date, 
     DATE_FORMAT(f.outbound_flight_date, '%d/%m/%Y') AS outbound_flight_date, 
     DATE_FORMAT(f.return_flight_date, '%d/%m/%Y') AS return_flight_date, 
    f.outbound_flight_number, 
    f.return_flight_number, 
    f.outbound_airline, 
    f.return_airline, 
    f.is_source_user, 
    f.user_classification, 
    f.age,
    g.hebrew_first_name,
    g.hebrew_last_name,
    g.english_first_name,
    g.english_last_name,
    g.is_main_user,
    g.identity_id,
    g.flights,
    g.flying_with_us,
    g.flights_direction,
    g.age as default_age
FROM 
    trip_tracker_${vacationId}.flights f
right JOIN 
    trip_tracker_${vacationId}.guest g
ON 
    f.user_id = g.user_id
`
}

const getVacationDetails = (vacationId, limit, offset) => {
//     return `
//  SELECT g.hebrew_first_name,g.hebrew_last_name,g.english_first_name,g.english_last_name,g.is_main_user,g.user_id,g.family_id, 
//     DATE_FORMAT(f.validity_passport, '%d/%m/%Y') AS validity_passport, 
//     f.passport_number,
//      DATE_FORMAT(f.birth_date, '%d/%m/%Y') AS birth_date, 
//      DATE_FORMAT(f.outbound_flight_date, '%d/%m/%Y') AS outbound_flight_date, 
//      DATE_FORMAT(f.return_flight_date, '%d/%m/%Y') AS return_flight_date, 
//     f.outbound_flight_number, 
//     f.return_flight_number, 
//     f.outbound_airline, 
//     f.return_airline, 
//     f.is_source_user, 
//     f.user_classification,
//     f.age,
//     g.is_main_user,
//     g.identity_id,
//     g.flights,
//     g.flying_with_us,
//     g.flights_direction,
//     g.age as default_age,
//     g.number_of_guests,g.number_of_rooms,g.total_amount,
//     ura.room_id,g.week_chosen,
//     CONCAT(
//        DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(g.date_chosen, '/', 1), '%Y-%m-%d'), '%d/%m/%Y'),
//         ' - ',
//       DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(g.date_chosen, '/', -1), '%Y-%m-%d'), '%d/%m/%Y')
//     ) AS date_chosen,
//     DATE_FORMAT(g.birth_date, '%d/%m/%Y') AS defaule_birth_date,
//     g.phone_a,g.phone_b,g.email,g.identity_id,ura.room_id,
//     p.form_of_payment,p.remains_to_be_paid,p.payment_currency
//     FROM trip_tracker_${vacationId}.guest g
//     left join trip_tracker_${vacationId}.user_room_assignments ura
//     on g.user_id = ura.user_id
//     left join trip_tracker_${vacationId}.flights f
//     on g.user_id = f.user_id
// 	left join trip_tracker_${vacationId}.payments p
//     on g.user_id = p.user_id;  
// `

return `SELECT 
    g.hebrew_first_name,
    g.hebrew_last_name,
    g.english_first_name,
    g.english_last_name,
    g.is_main_user,
    g.user_id,
    g.family_id, 
    DATE_FORMAT(f.validity_passport, '%d/%m/%Y') AS validity_passport, 
    f.passport_number,
    DATE_FORMAT(f.birth_date, '%d/%m/%Y') AS birth_date, 
    DATE_FORMAT(f.outbound_flight_date, '%d/%m/%Y') AS outbound_flight_date, 
    DATE_FORMAT(f.return_flight_date, '%d/%m/%Y') AS return_flight_date, 
    f.outbound_flight_number, 
    f.return_flight_number, 
    f.outbound_airline, 
    f.return_airline, 
    f.is_source_user, 
    f.user_classification,
    f.age,
    g.is_main_user,
    g.identity_id,
    g.flights,
    g.flying_with_us,
    g.flights_direction,
    g.age AS default_age,
    g.number_of_guests,
    g.number_of_rooms,
    g.total_amount,
    ura.room_id,
    g.week_chosen,
    CONCAT(
        DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(g.date_chosen, '/', 1), '%Y-%m-%d'), '%d/%m/%Y'),
        ' - ',
        DATE_FORMAT(STR_TO_DATE(SUBSTRING_INDEX(g.date_chosen, '/', -1), '%Y-%m-%d'), '%d/%m/%Y')
    ) AS date_chosen,
    DATE_FORMAT(g.birth_date, '%d/%m/%Y') AS defaule_birth_date,
    g.phone_a,
    g.phone_b,
    g.email,
    g.identity_id,
    p.form_of_payment,
    COALESCE(CAST(NULLIF(REPLACE(g.total_amount, ',', ''), '') AS DECIMAL(10,2)), 0)
        - COALESCE(p.total_paid, 0) AS remains_to_be_paid,
    NULL AS payment_currency
FROM
    trip_tracker_${vacationId}.guest g
LEFT JOIN
    trip_tracker_${vacationId}.user_room_assignments ura ON g.user_id = ura.user_id
LEFT JOIN
    trip_tracker_${vacationId}.flights f ON g.user_id = f.user_id
LEFT JOIN
    (
        SELECT
            family_id,
            MAX(payment_method) AS form_of_payment,
            SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) AS total_paid
        FROM trip_tracker_${vacationId}.payments
        GROUP BY family_id
    ) p ON g.family_id = p.family_id
WHERE
    (? = '' OR g.hebrew_first_name LIKE CONCAT('%',?,'%')
            OR g.hebrew_last_name  LIKE CONCAT('%',?,'%')
            OR g.identity_id       LIKE CONCAT('%',?,'%'))
GROUP BY
    g.user_id
ORDER BY g.hebrew_last_name, g.hebrew_first_name
LIMIT ${limit} OFFSET ${offset}
`
}

const getPaymentsDetails = (vacationId) => {
return `
SELECT
    f.family_id                                                               AS familyId,
    f.family_name                                                             AS familyName,
    REPLACE(f.total_amount, ',', '')                                          AS totalAmount,
    COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) AS paidAmount,
    COUNT(CASE WHEN p.status = 'completed' THEN 1 END)                       AS paymentCount
FROM trip_tracker_${vacationId}.families f
LEFT JOIN trip_tracker_${vacationId}.payments p ON f.family_id = p.family_id
GROUP BY f.family_id, f.family_name, f.total_amount
ORDER BY f.family_name;


`
//     return `WITH LatestPayments AS (
//     SELECT 
//         user_id,
//         MAX(created_at) AS latest_created_at
//     FROM 
//         trip_tracker_${vacationId}.payments
//     GROUP BY 
//         user_id
// ),
// FilteredPayments AS (
//     SELECT 
//         p.*
//     FROM 
//         trip_tracker_${vacationId}.payments p
//     JOIN 
//         LatestPayments lp 
//     ON 
//         p.user_id = lp.user_id AND p.created_at = lp.latest_created_at
// )
// SELECT 
//     p.id,
//     g.user_id,
//     g.family_id AS familyId,
//     p.payment_date AS paymentDate,
//     p.amount,
//     p.form_of_payment AS formOfPayment,
//     p.remains_to_be_paid AS remainsToBePaid,
//     p.payment_currency AS paymentCurrency,
//     p.amount_received AS amountReceived,
//     p.invoice,
//     p.created_at,
//     g.hebrew_first_name,
//     g.hebrew_last_name,
//     g.total_amount AS default_amount
// FROM 
//     trip_tracker_${vacationId}.guest g
// LEFT JOIN 
//     FilteredPayments p
// ON 
//     g.user_id = p.user_id
// WHERE 
//     g.is_main_user = 1
// ORDER BY 
//     g.family_id;
// `
   
}

module.exports = {
    getMainGuests,
    getAllGuests,
    getFlightsDetails,
    getVacationDetails,
    getPaymentsDetails
}