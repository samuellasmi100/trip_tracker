const roomsDb = require("./roomsDb")
const userRoomsDb = require("../userRooms/userRoomsDb")
const {getAvailableDatesByRoom} = require("../../utils/getAvailableDates")

const getAll = async (vacationId) => {
    const rooms = await roomsDb.getAll(vacationId)
    const availbleRooms = await userRoomsDb.getAllChosenRoom(vacationId)
    rooms.forEach((room) => {
        let weeks = [];
        
        availbleRooms.flat().forEach((availableRoom) => {
          if (availableRoom.room_id === room.rooms_id) {
            weeks.push({
                start_date: availableRoom.start_date,
                end_date: availableRoom.end_date,
                room_id: availableRoom.rooms_id,
            });
          }
        });
        if (weeks.length > 0) {
          room.week_chosen = weeks;
        }
      });
      
      return rooms
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