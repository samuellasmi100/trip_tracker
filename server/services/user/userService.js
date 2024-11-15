const userDb = require("./userDb")

const addOne = async (userData) => {
    return userDb.addOne(userData)
}
const getMainUsers = async () => {
    return userDb.getMainUsers()
}
module.exports = {
    addOne,
    getMainUsers
}