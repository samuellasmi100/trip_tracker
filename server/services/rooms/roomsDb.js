const connection = require("../../db/connection-wrapper");
const roomsQuery = require("../../sql/query/roomsQuery")

const getAll = async (vacationId) => {
    try {
      const sql = roomsQuery.getAll(vacationId)
      const response = await connection.execute(sql)
      return response
     
    } catch (error) { 
      console.log(error)
    }
}
const getRoomDetailsWithCounts = async () => {
  try {
    const sql = roomsQuery.getRoomDetailsWithCounts()
    const response = await connection.execute(sql)
    return response
   
  } catch (error) { 
    console.log(error)
  }
}
const updateRoom = async (data) => {
  try {
    const roomsId = data.rooms_id
    delete data.number_of_people
    delete data.id
    const sql = roomsQuery.updateRoom(data,roomsId)
    const parameters = Object.values(data)
    const response = await connection.executeWithParameters(sql,parameters)
    return response
   
  } catch (error) { 
    console.log(error)
  }
}


module.exports = {
  getAll,
  updateRoom,
  getRoomDetailsWithCounts
}