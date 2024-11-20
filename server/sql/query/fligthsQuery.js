const addParentFlightsDetails = () => {
    return `INSERT INTO flights (parent_id,validity_passport,passport_number,birth_date,
    outbound_flight_date,return_flight_date,outbound_flight_number,return_flight_number,age) values (?,?,?,?,?,?,?,?,?)`
}
const updateParentFlightsDetails = () => {
    return `UPDATE flights SET validity_passport = ? ,passport_number = ?,birth_date =?,
    outbound_flight_date = ?,return_flight_date = ?,outbound_flight_number = ?,return_flight_number = ?,age = ? WHERE parent_id = ?`
}
const addChildFlightsDetails = () => {
    return `INSERT INTO flights (child_id,parent_id,validity_passport,passport_number,birth_date,
    outbound_flight_date,return_flight_date,outbound_flight_number,return_flight_number,age) values (?,?,?,?,?,?,?,?,?)`
}
const updateChildrenFlightsDetails = () => {
    return `UPDATE flights SET parent_id = ?, validity_passport = ? ,passport_number = ?,birth_date =?,
    outbound_flight_date = ?,return_flight_date = ?,outbound_flight_number = ?,return_flight_number = ?,age = ? WHERE child_id = ?`
}

const getParentDetails = () => {
    return `SELECT parent_id as parentId,validity_passport as validityPassport,passport_number as passportNumber,birth_date as birthDate,
   outbound_flight_date as outboundFlightDate,return_flight_date as returnFlightDate,
   outbound_flight_number as outboundFlightNumber,return_flight_number as returnFlightNumber,age FROM flights where parent_id = ?;`
}
const getChildDetails = () => {
    return `SELECT parent_id as parentId,validity_passport as validityPassport,passport_number as passportNumber,birth_date as birthDate,
   outbound_flight_date as outboundFlightDate,return_flight_date as returnFlightDate,
   outbound_flight_number as outboundFlightNumber,return_flight_number as returnFlightNumber,
   age FROM flights where child_id = ?;`
}
module.exports = {
    addParentFlightsDetails,
    addChildFlightsDetails,
    updateParentFlightsDetails,
    getParentDetails,
    getChildDetails,
    updateChildrenFlightsDetails
}