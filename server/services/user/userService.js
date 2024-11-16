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
module.exports = {
    addParent,
    addChild,
    getMainUsers,
    getChildByParentId
}