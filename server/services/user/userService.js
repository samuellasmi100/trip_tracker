const userDb = require("./userDb")

const addParent = async (userData) => {
    return userDb.addParent(userData)
}
const addChild = async (userData) => {
    return userDb.addChild(userData)
}
const getMainUsers = async () => {
    return userDb.getMainUsers()
}
const getChildByParentId = async (id) => {
   return userDb.getChildByParentId(id)
  }
  const updateParentUser = async (userData) => {
    return userDb.updateParentUser(userData)
   }
   const updateChildUser = async (id,userData) => {
    return userDb.updateChildUser(id,userData)
   }
module.exports = {
    addParent,
    addChild,
    getMainUsers,
    getChildByParentId,
    updateParentUser,
    updateChildUser
}