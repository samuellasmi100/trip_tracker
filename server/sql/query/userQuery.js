
const addParent = (userData) =>{
  return `
  INSERT INTO parent_guest(${Object.keys(userData)}) VALUES(${Object.values(userData).map(() => '?')})`;
}

const addChild = (userData) =>{
  return `
  INSERT INTO child_guest(${Object.keys(userData)}) VALUES(${Object.values(userData).map(() => '?')})`;
}

const getMainUsers = () => {
  return `SELECT 
    pg.first_name,
    pg.last_name,
    pg.flights,
    pg.phone_a,
    pg.phone_b,
    pg.identity_id,
    pg.email,
    pg.number_of_guests,
    pg.number_of_rooms,
    pg.total_amount,
    pg.parent_id,
    pg.flights_direction,
    pa.remains_to_be_paid
FROM 
    parent_guest pg
LEFT JOIN 
    (
        SELECT 
            p1.parent_id, 
            p1.remains_to_be_paid
        FROM 
            payments p1
        JOIN 
            (SELECT parent_id, MAX(id) AS latest_payment_id
             FROM payments
             GROUP BY parent_id) p2
        ON p1.parent_id = p2.parent_id AND p1.id = p2.latest_payment_id
    ) pa
ON 
    pg.parent_id = pa.parent_id;`
//   return `SELECT pg.first_name,pg.last_name,pg.flights,pg.phone_a,pg.phone_b,
// pg.identity_id,pg.email,pg.number_of_guests,pg.number_of_rooms,pg.total_amount,parent_id
// FROM parent_guest pg`
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

const updateParentUser = (userData,id) => {
  return `UPDATE parent_guest SET ${Object.keys(userData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE parent_id = '${id}'`

}
const updateChildUser = (userData,id) => {
  return `UPDATE child_guest SET ${Object.keys(userData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE child_id = '${id}'`

}
module.exports ={
  addParent,
  addChild,
  getMainUsers,
  getChildByParentId,
  updateParentUser,
  updateChildUser
}

