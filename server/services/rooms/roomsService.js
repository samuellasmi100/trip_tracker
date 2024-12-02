const roomsDb = require("./roomsDb")

const getAll = async () => {
    return await roomsDb.getAll()
}
const getRoomDetailsWithCounts = async () => {
    return await roomsDb.getRoomDetailsWithCounts()
}
const updateRoom = async (data) => {
    return await roomsDb.updateRoom(data)
}
module.exports = {
    getAll,
    getRoomDetailsWithCounts,
    updateRoom
}