const addParentFlightsDetails = (flightsData) => {
    return `INSERT INTO flights (${Object.keys(flightsData)}) values (${Object.values(flightsData).map(() => '?')})`
}
const updateParentFlightsDetails = (flightsData,id) => {
    return `UPDATE flights SET ${Object.keys(flightsData)
    .map(key => `${key}=?`)
    .join(',')}
  WHERE parent_id = '${id}'`
}

const addChildFlightsDetails = (flightsData) => {
    return `INSERT INTO flights (${Object.keys(flightsData)}) values (${Object.values(flightsData).map(() => '?')})`
}
const updateChildrenFlightsDetails = (flightsData,id) => {
    return `UPDATE flights SET ${Object.keys(flightsData)
    .map(key => `${key}=?`)
    .join(',')}
    WHERE child_id = '${id}'`
}

const getParentDetails = () => {
    return `SELECT parent_id,validity_passport,passport_number ,birth_date ,
   outbound_flight_date,return_flight_date ,
   outbound_flight_number ,return_flight_number ,age FROM flights where parent_id = ?;`
}
const getChildDetails = () => {
    return `SELECT parent_id ,validity_passport,passport_number,birth_date ,
   outbound_flight_date ,return_flight_date ,
   outbound_flight_number,return_flight_number,
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