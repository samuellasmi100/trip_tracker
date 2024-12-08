const roomsDb = require("./roomsDb")
const {getAvailableDates} = require("../../utils/getAvailableDates")
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
const getRoomAvailableDates = async (vacationId,roomId,startDate,endDate) => {
   
    let datesUnAvailable = await roomsDb.getUnAvailableDates(vacationId,roomId)
    if(datesUnAvailable.length === 0){
      return []
    }else {
        const result = getAvailableDates(datesUnAvailable,startDate,endDate)
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