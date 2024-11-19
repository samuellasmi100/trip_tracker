const connection = require("../../db/connection-wrapper");
const roomsQuery = require("../../sql/query/roomsQuery")

const getAll = async () => {
    try {
      const sql = roomsQuery.getAll()
      const response = await connection.execute(sql)
      return response
     
    } catch (error) { 
      console.log(error)
    }
}

const assignMainRoom = async (parentId,roomId) => {
 
  try {
    const sql = roomsQuery.assignMainRoom()
    let sql2 = roomsQuery.lockRoom()
    const parameters = [parentId,roomId]
    const parameters2 = [1,roomId]
     await connection.executeWithParameters(sql,parameters)
     await connection.executeWithParameters(sql2,parameters2)
     
   
  } catch (error) { 
    console.log(error)
  }
}
const getParentRoom = async (id) => {
 
  try {
    const sql = roomsQuery.getParentRoom()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
   return response
     
   
  } catch (error) { 
    console.log(error)
  }
}

module.exports = {
  getAll,
  assignMainRoom,
  getParentRoom
}