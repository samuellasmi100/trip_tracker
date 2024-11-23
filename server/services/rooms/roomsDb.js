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
    const parameters = [parentId,roomId]
     await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}

const assignRoom = async (userId,roomId,type,familyId) => {
  try {
    let sql
    if(type === "parent"){
      sql = roomsQuery.assignParentRoom()
    }else {
      sql = roomsQuery.assignChildRoom()
    }  
    const parameters = [userId,roomId,familyId]
    await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}

const updateAssignRoom = async (userId,roomId,type,familyId) => {
  try {
    let sql
    if(type === "parent"){
      sql = roomsQuery.updateAssignParentRoom()
    }else {
      sql = roomsQuery.updateAssignChildRoom()
    }  
    const parameters = [roomId,userId]
    await connection.executeWithParameters(sql,parameters) 
  } catch (error) { 
    console.log(error)
  }
}
const updateMainRoom = async (roomDetails,parentId) => {
 
  try {
    const sql = `
    INSERT INTO parent_room_details (room_id, parent_id)
    VALUES ${roomDetails.map(() => '(?, ?)').join(', ')}
    ON DUPLICATE KEY UPDATE room_id = VALUES(room_id);`;
    const parameters = roomDetails.flatMap((room) => [room.roomId,parentId]);
    await connection.executeWithParameters(sql,parameters)

  } catch (error) { 
    console.log(error)
  }
}

const removeMainRoom = async (parentId) => {
  try {
    const sql = roomsQuery.removeMainRoom()
    const parameters = [parentId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const getFamilyRoom = async (id) => {
  try {
    const sql = roomsQuery.getFamilyRoom()
    const parameters = [id]
    const response = await connection.executeWithParameters(sql,parameters)
   return response
     
   
  } catch (error) { 
    console.log(error)
  }
}

const unLockRoom = async (roomId) => {
  try {
    let sql = roomsQuery.unLockRoom()
     const parameters = [0,roomId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const lockRoom = async (roomId) => {
  try {
    let sql = roomsQuery.lockRoom()
     const parameters = [1,roomId]
    await connection.executeWithParameters(sql,parameters)
  } catch (error) { 
    console.log(error)
  }
}

const getChossenRoom = async (userId,type) => {
  try {
    let sql
    if(type === "parent"){
      sql = roomsQuery.getParentRoom()
    }else {
      sql = roomsQuery.getChildRoom()
    }  
     const parameters = [userId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}

const removeUserAssignMainRoom = async (familyId) => {
  try {
     let sql = roomsQuery.removeUserAssignMainRoom()
     const parameters = [familyId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}

const removeUserAssignMainRoomOfUser = async (familyId,roomId) => {
  console.log(familyId,roomId)
  try {
     let sql = roomsQuery.removeUserAssignMainRoomOfUser()
     const parameters = [roomId,familyId]
     const response = await connection.executeWithParameters(sql,parameters)
      return response

  } catch (error) { 
    console.log(error)
  }
}
module.exports = {
  getAll,
  assignMainRoom,
  getFamilyRoom,
  updateMainRoom,
  removeMainRoom,
  unLockRoom,
  lockRoom,
  assignRoom,
  getChossenRoom,
  updateAssignRoom,
  removeUserAssignMainRoom,
  removeUserAssignMainRoomOfUser
}