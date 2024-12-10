const connection = require("../../db/connection-wrapper");
const userQuery = require("../../sql/query/userQuery")
const ErrorType = require("../../serverLogs/errorType");
const ErrorMessage = require("../../serverLogs/errorMessage");

const addGuest = async (data,vacationId) => {
  delete data.userType
  const sql = userQuery.addGuest(data,vacationId)
  const parameters = Object.values(data)
  try {
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    throw new ErrorMessage(ErrorType.SQL_GENERAL_ERROR,
      { sql: sql, parameters: parameters, time: new Date() },
      error
    );
  }
}


const getFamilyGuests = async (id,vacationId) => {
    try {
      const sql = userQuery.getFamilyGuests(vacationId)
      const parameters = [id]
      const response = await connection.executeWithParameters(sql,parameters)
      return response
    } catch (error) { 
      console.log(error)
    }
}

const getFamilyMamber = async (id,vacationId) => {

  try {
    const sql = userQuery.getFamilyMamber(vacationId)
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
    return response
  } catch (error) { 
    console.log(error)
  }
}


const updateGuest = async (data,vacationId) => {
    try {
      const userId = data.user_id
      delete data.family_name
      delete data.userType
      const sql = userQuery.updateGuest(data,userId,vacationId)
      const parameters = Object.values(data)
      const response = await connection.executeWithParameters(sql,parameters)
      return response
     
    } catch (error) { 
      console.log(error)
      throw new ErrorMessage(error.errorType,sql, error);
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
    getFamilyMamber,
    saveRegistrationForm,
    
}