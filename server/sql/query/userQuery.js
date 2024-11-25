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

const getFamilyMambers = () => {
  return `SELECT fa.family_id,fa.family_name,
gu.first_name,
gu.last_name,
gu.flights,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.number_of_guests,
gu.number_of_rooms,
gu.total_amount,
gu.parent_id,
gu.flights_direction,
gu.child_id,
gu.parent_id
FROM families fa join guest gu
on fa.family_id = gu.family_id where gu.family_id = ?`
}

const getFamilyMamber = () => {
  return `SELECT fa.family_id,fa.family_name,
gu.first_name,
gu.last_name,
gu.flights,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.flights_direction,
gu.parent_id,
gu.child_id
FROM families fa join guest gu
on fa.family_id = gu.family_id where gu.child_id= ?`
}

const getParentFamilyMamber = () => {
  return `SELECT fa.family_id,fa.family_name,
gu.first_name,
gu.last_name,
gu.flights,
gu.phone_a,
gu.phone_b,
gu.identity_id,
gu.email,
gu.flights_direction,
gu.parent_id,
gu.child_id,
gu.total_amount
FROM families fa join guest gu
on fa.family_id = gu.family_id where gu.parent_id= ?`
}

const updateGuest = (userData,id) => {
  return `UPDATE guest SET ${Object.keys(userData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE parent_id = '${id}'`

}

const addChild = (userData) =>{
  return `
  INSERT INTO guest(${Object.keys(userData)}) VALUES(${Object.values(userData).map(() => '?')})`;
}

const saveRegistrationForm = (userData) =>{
  return `INSERT INTO files (filename, fileType, filePath,family_id) VALUES (?, ?, ?,?)`;
}

const updateChild = (userData,id) => {
  return `UPDATE guest SET ${Object.keys(userData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE child_id = '${id}'`

}

module.exports ={
  addChild,
  updateGuest,
  updateChild,
  addFamily,
  getFamilies,
  addGuest,
  getFamilyMambers,
  getFamilyMamber,
  getFamilyMamber,
  getParentFamilyMamber,
  saveRegistrationForm
}

