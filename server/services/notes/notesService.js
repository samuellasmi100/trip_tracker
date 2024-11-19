const roomsDb = require("./notesDb")

const getAll = async () => {
    return roomsDb.getAll()
}

const assignMainRoom = async (roomDetails) => {
    // console.log(roomDetails)
    for (const room of roomDetails) {
        await roomsDb.assignMainRoom(room.parentId, room.roomId);
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