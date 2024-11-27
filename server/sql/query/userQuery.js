const addGuest = (userData) =>{
  return `
  INSERT INTO guest(${Object.keys(userData)}) VALUES(${Object.values(userData).map(() => '?')})`;
}

const addFamily = (userData) =>{
  return `
  INSERT INTO families(${Object.keys(userData)}) VALUES(${Object.values(userData).map(() => '?')})`;
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

const getFamilyGuests = () => {
  return `SELECT fa.family_id,fa.family_name,
gu.hebrew_name,
gu.english_name,
gu.flights,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.number_of_guests,
gu.number_of_rooms,
gu.total_amount,
gu.flights_direction,
gu.user_id,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM families fa join guest gu
on fa.family_id = gu.family_id where gu.family_id = ?`
}

const getFamilyMamber = () => {
  return `SELECT fa.family_id,fa.family_name,
gu.hebrew_name,
gu.english_name,
gu.flights,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.flights_direction,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM families fa join guest gu
on fa.family_id = gu.family_id where gu.user_id= ?`
}

const getParentFamilyMamber = () => {
  return `SELECT fa.family_id,fa.family_name,
gu.hebrew_name,
gu.english_name,
gu.flights,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.flights_direction,
gu.total_amount,gu.is_main_user,gu.user_type,gu.is_in_group,gu.arrival_date,gu.departure_date,gu.address
FROM families fa join guest gu
on fa.family_id = gu.family_id where gu.user_id= ?`
}

const updateGuest = (userData,id) => {
  return `UPDATE guest SET ${Object.keys(userData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE user_id = '${id}'`
}

const saveRegistrationForm = (userData) =>{
  return `INSERT INTO files (filename, fileType, filePath,family_id) VALUES (?, ?, ?,?)`;
}

module.exports ={
  updateGuest,
  addFamily,
  getFamilies,
  addGuest,
  getFamilyGuests,
  getFamilyMamber,
  getFamilyMamber,
  getParentFamilyMamber,
  saveRegistrationForm
}

