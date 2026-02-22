const roomsDb = require("./roomsDb")
const userRoomsDb = require("../userRooms/userRoomsDb")
const {getAvailableDatesByRoom} = require("../../utils/getAvailableDates")

const getAll = async (vacationId) => {
    const rooms = await roomsDb.getAll(vacationId)
      return rooms
}
const getRoomAvailable = async (vacationId,startData,endDate) => {
  return await roomsDb.getRoomAvailable(vacationId,startData,endDate)
}
const getRoomDetailsWithCounts = async (vacationId) => {
    return await roomsDb.getRoomDetailsWithCounts(vacationId)
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

const getBoardData = async (vacationId) => {
    return await roomsDb.getBoardData(vacationId);
};

module.exports = {
    getAll,
    getRoomDetailsWithCounts,
    updateRoom,
    getRoomAvailable,
    getRoomAvailableDates,
    getBoardData,
}