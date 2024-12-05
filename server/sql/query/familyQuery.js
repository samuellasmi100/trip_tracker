const addFamily = (vacationId) =>{
    return `INSERT INTO trip_tracker_${vacationId}.families (family_name,family_id) VALUES (?,?)`
  }
  
  const getFamilies = (vacationId) =>{
   return `SELECT 
      f.family_id,
      f.family_name,
      p.amount,
      p.remains_to_be_paid
  FROM 
      trip_tracker_${vacationId}.families f
  LEFT JOIN 
      (SELECT 
           family_id, 
           id, 
           created_at, 
           amount,
           remains_to_be_paid
       FROM 
           trip_tracker_${vacationId}.payments 
       WHERE 
           (family_id, created_at) IN 
           (SELECT 
                family_id, 
                MAX(created_at) 
            FROM 
                trip_tracker_${vacationId}.payments 
            GROUP BY 
                family_id)) p
  ON f.family_id = p.family_id`
  }
  
  module.exports ={
    addFamily,
    getFamilies,
  }
  
  