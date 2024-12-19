const getMainGuests = (vacationId) => {
    return `SELECT 
    g.hebrew_first_name,
    g.hebrew_last_name,
    g.english_first_name,
    g.english_last_name,
    g.is_main_user,
    g.user_id,
    g.family_id,
    g.age,
    g.birth_date,
    g.number_of_guests,
    g.phone_a,
    g.phone_b,
    g.email,
    g.identity_id,
    (SELECT COUNT(*) 
     FROM trip_tracker_${vacationId}.guest 
     WHERE family_id = g.family_id) AS user_in_system_count
FROM 
    trip_tracker_${vacationId}.guest g
WHERE 
    g.is_main_user = 1;
;`
}

const getAllGuests = (vacationId) => {
    return `SELECT gu.hebrew_first_name,gu.hebrew_last_name,gu.english_first_name,gu.english_last_name,gu.is_main_user,gu.user_id,gu.family_id,age,
    gu.birth_date,gu.phone_a,gu.phone_b,gu.email,gu.identity_id,ura.room_id
    FROM trip_tracker_${vacationId}.guest gu
    left join trip_tracker_${vacationId}.user_room_assignments ura
    on gu.user_id = ura.user_id;
;`
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

const getVacationDetails = (vacationId) => {
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
    ura.room_id,
    p.form_of_payment,
    p.remains_to_be_paid,
    p.payment_currency
FROM 
    trip_tracker_${vacationId}.guest g
LEFT JOIN 
    trip_tracker_${vacationId}.user_room_assignments ura ON g.user_id = ura.user_id
LEFT JOIN 
   trip_tracker_${vacationId}.flights f ON g.user_id = f.user_id
LEFT JOIN 
    (
        SELECT 
            p1.* 
        FROM 
           trip_tracker_${vacationId}.payments p1
        INNER JOIN (
            SELECT 
                user_id, 
                MAX(created_at) AS latest_payment 
            FROM 
               trip_tracker_${vacationId}.payments 
            GROUP BY 
                user_id
        ) p2 ON p1.user_id = p2.user_id AND p1.created_at = p2.latest_payment
    ) p ON g.user_id = p.user_id
GROUP BY 
    g.user_id
`
}

const getPaymentsDetails = (vacationId) => {
    return `WITH LatestPayments AS (
    SELECT 
        family_id,
        MAX(created_at) AS latest_created_at
    FROM 
        trip_tracker_${vacationId}.payments
    GROUP BY 
        family_id
)
SELECT 
    p.id,
    g.user_id,
    g.family_id AS familyId,
    p.payment_date AS paymentDate,
    p.amount,
    p.form_of_payment AS formOfPayment,
    p.remains_to_be_paid AS remainsToBePaid,
    p.payment_currency AS paymentCurrency,
    p.amount_received AS amountReceived,
    p.invoice,
    p.created_at,
    g.hebrew_first_name,
    g.hebrew_last_name,
    g.total_amount AS default_amount
FROM 
    trip_tracker_${vacationId}.guest g
LEFT JOIN 
    trip_tracker_${vacationId}.payments p
ON 
    g.family_id = p.family_id
LEFT JOIN 
    LatestPayments l
ON 
    p.family_id = l.family_id AND p.created_at = l.latest_created_at
WHERE 
    g.is_main_user = 1
ORDER BY 
    g.family_id;
`
   
}
module.exports = {
    getMainGuests,
    getAllGuests,
    getFlightsDetails,
    getVacationDetails,
    getPaymentsDetails
}