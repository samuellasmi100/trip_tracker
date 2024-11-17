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


module.exports = {
  getAll
}