const connection = require("../../db/connection-wrapper");
const userQuery = require("../../sql/query/userQuery")

const addParent = async (useData) => {
  try {
    const sql = userQuery.addParent()
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
const addChild = async (useData) => {
    try {
      const sql = userQuery.addChild()
      const parametrs = [ 
          useData.firstName,
          useData.lastName,
          useData.email,
          useData.phoneA,
          useData.phoneB,
          useData.identitId,
          useData.childId,
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
const getChildByParentId = async (id) => {
    try {
      const sql = userQuery.getChildByParentId()
      const parameters = [id]
      const response = await connection.executeWithParameters(sql,parameters)
      return response
     
    } catch (error) { 
      console.log(error)
    }
  }
module.exports = {
    addParent,
    addChild,
    getMainUsers,
    getChildByParentId
}