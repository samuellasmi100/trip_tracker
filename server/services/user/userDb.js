const connection = require("../../db/connection-wrapper");
const userQuery = require("../../sql/query/userQuery")

const addGuest = async (data) => {
  try {
    const sql = userQuery.addGuest(data)
    const parameters = Object.values(data)
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const addFamily = async (data) => {
  try {
    const sql = userQuery.addFamily(data)
    const parameters = Object.values(data)

    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const addChild = async (data) => {
    try {
      const sql = userQuery.addChild(data)
      const parameters = Object.values(data)
      await connection.executeWithParameters(sql,parameters)
    } catch (error) { 
      console.log(error)
    }
}

const getFamilyMambers = async (id) => {
    try {
      const sql = userQuery.getFamilyMambers()
      const parameters = [id]
      const response = await connection.executeWithParameters(sql,parameters)
      return response
    } catch (error) { 
      console.log(error)
    }
}

const getFamilyMamber = async (id) => {
  try {
    const sql = userQuery.getFamilyMamber()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
    return response
  } catch (error) { 
    console.log(error)
  }
}

const getParentFamilyMamber = async (id) => {
  try {
    const sql = userQuery.getParentFamilyMamber()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
    return response
  } catch (error) { 
    console.log(error)
  }
}

const getFamilies = async () => {
  try {
    const sql = userQuery.getFamilies()
    const response = await connection.execute(sql)
    return response
  } catch (error) { 
    console.log(error)
  }
}

const getAllFamilyMambers = async (id) => {
  try {
    const sql = userQuery.getAllFamilyMambers()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql)
    return response
  } catch (error) { 
    console.log(error)
  }
}

const updateGuest = async (data) => {
    try {
      const parentId = data.parent_id
      delete data.parent_id
      delete data.family_name
      const sql = userQuery.updateGuest(data,parentId)
      const parameters = Object.values(data)
      const response = await connection.executeWithParameters(sql,parameters)
      return response
     
    } catch (error) { 
      console.log(error)
    }
}

const updateChild = async (data) => {
    try {
      const childId = data.child_id
      delete data.child_id
      delete data.family_name

      const sql = userQuery.updateChild(data,childId)
      const parameters = Object.values(data)
      const response = await connection.executeWithParameters(sql,parameters)
      return response
     
    } catch (error) { 
      console.log(error)
    }
}
const saveRegistrationForm = async (filename,fileType,filePath,id) => {
  try {

    const sql = userQuery.saveRegistrationForm()
    const parameters = [filename,fileType,filePath,id]
    const response = await connection.executeWithParameters(sql,parameters)
    return response
   
  } catch (error) { 
    console.log(error)
  }
}

module.exports = {
    addGuest,
    addChild,
    getFamilyMambers,
    updateGuest,
    updateChild,
    addFamily,
    getFamilies,
    getAllFamilyMambers,
    getFamilyMamber,
    getParentFamilyMamber,
    saveRegistrationForm
}