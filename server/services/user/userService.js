const userDb = require("./userDb")

const addGuest = async (data) => {
    return userDb.addGuest(data)
}
const addFamily = async (data) => {
    return userDb.addFamily(data)
}
const addChild = async (data) => {
    return userDb.addChild(data)
}
const getFamilyMambers = async (id) => {
    return userDb.getFamilyMambers(id)
}
const getChildByParentId = async (id) => {
    return userDb.getChildByParentId(id)
}
const updateGuest = async (data) => {
    return userDb.updateGuest(data)
}
const updateChild = async (data) => {
    return userDb.updateChild(data)
}
const getFamilies = async () => {
    return userDb.getFamilies()
}
const getAllFamilyMambers = async (id) => {
    return userDb.getAllFamilyMambers(id)
}

module.exports = {
    addGuest,
    addChild,
    getFamilyMambers,
    getChildByParentId,
    updateGuest,
    updateChild,
    addFamily,
    getFamilies,
    getAllFamilyMambers
}