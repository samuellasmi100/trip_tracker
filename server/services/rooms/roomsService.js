const roomsDb = require("./roomsDb")

const getAll = async () => {
    return roomsDb.getAll()
}

const assignMainRoom = async (roomDetails,parentId) => {
    for (const room of roomDetails) {
        await roomsDb.assignMainRoom(parentId, room.roomId);
    }
   
}
const getParentRoom = async (id) => {
  
    return roomsDb.getParentRoom(id)
}
module.exports = {
    getAll,
    assignMainRoom,
    getParentRoom
}