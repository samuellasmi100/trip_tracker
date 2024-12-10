const roomsDb = require("./roomsDb")
const {getAvailableDatesByRoom} = require("../../utils/getAvailableDates")

const getAll = async (vacationId) => {
    return await roomsDb.getAll(vacationId)
}
const getRoomAvailable = async (vacationId,startData,endDate) => {
  return await roomsDb.getRoomAvailable(vacationId,startData,endDate)
}
const getRoomDetailsWithCounts = async () => {
    return await roomsDb.getRoomDetailsWithCounts()
}
const updateRoom = async (data,vacationId) => {
    return await roomsDb.updateRoom(data,vacationId)
}
const getRoomAvailableDates = async (vacationId,startDate,endDate) => {
    let datesUnAvailable = await roomsDb.getUnAvailableDates(vacationId)
    if(datesUnAvailable.length === 0){
      return []
    }else {
        const result = getAvailableDatesByRoom(datesUnAvailable,startDate,endDate)
        return result
    }
 
}

module.exports = {
    getAll,
    getRoomDetailsWithCounts,
    updateRoom,
    getRoomAvailable,
    getRoomAvailableDates
}