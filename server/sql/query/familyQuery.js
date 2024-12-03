const addFamily = () =>{
    return `INSERT INTO families (family_name,family_id) VALUES (?,?)`
  }
  
  const getFamilies = () =>{
   return `SELECT 
      f.family_id,
      f.family_name,
      p.amount,
      p.remains_to_be_paid
  FROM 
      families f
  LEFT JOIN 
      (SELECT 
           family_id, 
           id, 
           created_at, 
           amount,
           remains_to_be_paid
       FROM 
           payments 
       WHERE 
           (family_id, created_at) IN 
           (SELECT 
                family_id, 
                MAX(created_at) 
            FROM 
                payments 
            GROUP BY 
                family_id)) p
  ON f.family_id = p.family_id`
  }
  module.exports ={
    addFamily,
    getFamilies,
  }
  
  