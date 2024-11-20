const connection = require("../../db/connection-wrapper");
const userQuery = require("../../sql/query/userQuery")

const addParent = async (userData) => {
  try {
    const sql = userQuery.addParent(userData)
    const parameters = Object.values(userData)
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const addChild = async (userData) => {
    try {
      const sql = userQuery.addChild(userData)
      const parameters = Object.values(userData)
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
      const parentId = userData.parent_id
      delete userData.parent_id
      delete userData.remains_to_be_paid
      const sql = userQuery.updateParentUser(userData,parentId)
      const parameters = Object.values(userData)
      const response = await connection.executeWithParameters(sql,parameters)
      return response
     
    } catch (error) { 
      console.log(error)
    }
}

const updateChildUser = async (userData) => {
    try {
      const childId = userData.child_id
      delete userData.child_id
      delete userData.flights
      const sql = userQuery.updateChildUser(userData,childId)
      const parameters = Object.values(userData)
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