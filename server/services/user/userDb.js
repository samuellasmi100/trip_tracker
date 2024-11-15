const connection = require("../../db/connection-wrapper");
const userQuery = require("../../sql/query/userQuery")

const addOne = async (useData) => {
  try {
    const sql = userQuery.addOne()
    const parametrs = [ 
        useData.firstName,
        useData.lastName,
        useData.email,
        useData.phoneA,
        useData.phoneB,
        useData.numberOfGuests,
        useData.numberOfRooms,
        useData.totalAmount,
        useData.includesFlight,
        useData.identitId,
        useData.parentId
    ]
    
    await connection.executeWithParameters(sql,parametrs)
  } catch (error) { 
    console.log(error)
  }
}
const getMainUsers = async () => {
    try {
      const sql = userQuery.getMainUsers()
      const response = await connection.execute(sql)
      return response
     
    } catch (error) { 
      console.log(error)
    }
  }

module.exports = {
    addOne,
    getMainUsers
}