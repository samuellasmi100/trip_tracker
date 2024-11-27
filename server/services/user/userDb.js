const connection = require("../../db/connection-wrapper");
const userQuery = require("../../sql/query/userQuery")

const addGuest = async (data) => {
  try {
    delete data.userType
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

const getFamilyGuests = async (id) => {
    try {
      const sql = userQuery.getFamilyGuests()
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

const updateGuest = async (data) => {
    try {
      const userId = data.user_id
      delete data.family_name
      delete data.userType

      const sql = userQuery.updateGuest(data,userId)
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
    getFamilyGuests,
    updateGuest,
    addFamily,
    getFamilies,
    getFamilyMamber,
    getParentFamilyMamber,
    saveRegistrationForm
}