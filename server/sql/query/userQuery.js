
const addOne = () =>{
  return `
  INSERT INTO parent_guest(first_name,last_name,email,phone_a,phone_b,number_of_guests,
  number_of_rooms,total_amount,flights,identit_id,parent_id) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
}

const getMainUsers = () => {
  return `SELECT first_name,last_name,total_amount,flights,parent_id FROM parent_guest;`
}
module.exports ={
  addOne,
  getMainUsers
}

