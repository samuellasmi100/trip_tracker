const addFamily = (vacationId) =>{
    return `INSERT INTO trip_tracker_${vacationId}.families (family_name,family_id) VALUES (?,?)`
  }
  
  const getFamilies = (vacationId) =>{

 return `WITH LatestPayments AS (
    SELECT 
        p.family_id,
        p.user_id,
        p.remains_to_be_paid,
        ROW_NUMBER() OVER (PARTITION BY p.user_id ORDER BY p.created_at DESC) AS row_num
    FROM 
        trip_tracker_${vacationId}.payments p
)
SELECT 
    fa.family_id,
    fa.family_name,
    gu.hebrew_first_name,
    gu.hebrew_last_name,
    gu.english_last_name,
    gu.number_of_guests,
    gu.total_amount,
    lp.remains_to_be_paid,
    (SELECT COUNT(*) 
     FROM trip_tracker_${vacationId}.guest 
     WHERE family_id = fa.family_id) AS user_in_system_count
FROM 
    trip_tracker_${vacationId}.families fa
JOIN 
    trip_tracker_${vacationId}.guest gu
ON 
    fa.family_id = gu.family_id
LEFT JOIN 
    LatestPayments lp 
ON 
    gu.family_id = lp.family_id AND gu.user_id = lp.user_id AND lp.row_num = 1
WHERE 
    gu.is_main_user = 1;
`


//    return `SELECT 
//       f.family_id,
//       f.family_name,
//       p.amount,
//       p.remains_to_be_paid
//   FROM 
//       trip_tracker_${vacationId}.families f
//   LEFT JOIN 
//       (SELECT 
//            family_id, 
//            id, 
//            created_at, 
//            amount,
//            remains_to_be_paid
//        FROM 
//            trip_tracker_${vacationId}.payments 
//        WHERE 
//            (family_id, created_at) IN 
//            (SELECT 
//                 family_id, 
//                 MAX(created_at) 
//             FROM 
//                 trip_tracker_${vacationId}.payments 
//             GROUP BY 
//                 family_id)) p
//   ON f.family_id = p.family_id`
  }
  
  module.exports ={
    addFamily,
    getFamilies,
  }
  
  