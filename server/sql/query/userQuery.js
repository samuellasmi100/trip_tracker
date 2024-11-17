
const addParent = () =>{
  return `
  INSERT INTO parent_guest(first_name,last_name,email,phone_a,phone_b,number_of_guests,
  number_of_rooms,total_amount,flights,identity_id,parent_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
}

const addChild = () =>{
  return `
  INSERT INTO child_guest(first_name,last_name,email,phone_a,phone_b,
  identity_id,child_id,parent_id) VALUES(?,?,?,?,?,?,?,?)`;
}
const getMainUsers = () => {
  return `SELECT pg.first_name as name,pg.last_name as lastName,pg.flights,pg.phone_a as phoneA,pg.phone_b as phoneB,
pg.identity_id as identityId,pg.email,pg.number_of_guests as numberOfGuests,pg.number_of_rooms as
numberOfRooms,pg.total_amount as totalAmount,parent_id as parentId
FROM parent_guest pg`
}
const getChildByParentId = () =>{
  return `SELECT first_name as name,last_name as lastName,phone_a as phoneA,phone_b as phoneB,
identity_id as identityId,email,child_id as childId, parent_id as parentId from child_guest where parent_id = ?;`
}

const updateParentUser = () => {
  return `UPDATE parent_guest SET 
first_name = ?,
last_name =? ,
email = ?,
phone_a = ?,
phone_b = ?,
number_of_guests = ?,
number_of_rooms = ?,
total_amount = ?,
flights = ?,
identity_id  = ?
where parent_id = ?`
}
module.exports ={
  addParent,
  addChild,
  getMainUsers,
  getChildByParentId,
  updateParentUser
}

