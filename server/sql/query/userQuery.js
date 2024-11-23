const addGuest = (userData) =>{
  return `
  INSERT INTO guest(${Object.keys(userData)}) VALUES(${Object.values(userData).map(() => '?')})`;
}

const addFamily = (userData) =>{
  return `
  INSERT INTO families(${Object.keys(userData)}) VALUES(${Object.values(userData).map(() => '?')})`;
}

const getFamilies = () =>{
  return `SELECT f.family_name,f.family_id,p.remains_to_be_paid FROM families f join payments p on p.family_id = f.family_id ORDER BY p.family_id DESC limit 1`
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

const getChildByParentId = () =>{
  return `SELECT cg.first_name,cg.last_name,cg.phone_a,cg.phone_b,
cg.identity_id,cg.email,
cg.child_id, cg.parent_id ,pg.flights
from child_guest cg 
join parent_guest pg
on pg.parent_id = cg.parent_id
where cg.parent_id = ?;`
}

const updateChild = (userData,id) => {
  return `UPDATE guest SET ${Object.keys(userData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE child_id = '${id}'`

}

module.exports ={
  addChild,
  getChildByParentId,
  updateGuest,
  updateChild,
  addFamily,
  getFamilies,
  addGuest,
  getFamilyMambers
}

