const roomsDb = require("./roomsDb")

const getAll = async (vacationId) => {
    return await roomsDb.getAll(vacationId)
}
const getRoomAvailable = async (vacationId,startData,endDate) => {
  return await roomsDb.getRoomAvailable(vacationId,startData,endDate)
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
    updateRoom,
    getRoomAvailable
}