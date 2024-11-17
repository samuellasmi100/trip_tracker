const connection = require("../../db/connection-wrapper");
const userQuery = require("../../sql/query/userQuery")

const addParent = async (userData) => {
  try {
    const sql = userQuery.addParent()
    const parameters = [ 
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneA,
        userData.phoneB,
        userData.numberOfGuests,
        userData.numberOfRooms,
        userData.totalAmount,
        userData.includesFlight,
        userData.identityId,
        userData.parentId
    ]
    
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const addChild = async (useData) => {
    try {
      const sql = userQuery.addChild()
      const parameters = [ 
          useData.firstName,
          useData.lastName,
          useData.email,
          useData.phoneA,
          useData.phoneB,
          useData.identityId,
          useData.childId,
          useData.parentId
      ]
      await connection.executeWithParameters(sql,parameters)
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

const updateParentUser = async (userData) => {
    try {
      const sql = userQuery.updateParentUser()
      const parameters = [ 
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneA,
        userData.phoneB,
        userData.numberOfGuests,
        userData.numberOfRooms,
        userData.totalAmount,
        userData.includesFlight,
        userData.identityId,
        userData.parentId
    ]
      const response = await connection.executeWithParameters(sql,parameters)
      return response
     
    } catch (error) { 
      console.log(error)
    }
}

const updateChildUser = async (id,userData) => {
    try {
      const sql = userQuery.updateChildUser()
      const parameters = []
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
    getChildByParentId,
    updateParentUser,
    updateChildUser
}