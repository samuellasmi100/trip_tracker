const roomsDb = require("./roomsDb")

const getAll = async () => {
    return roomsDb.getAll()
}

const assignMainRoom = async (roomDetails, parentId) => {
    const checkIfUserAlreadyAssign = await getParentRoom(parentId)

    if (roomDetails.length === 0) {
        const ids = checkIfUserAlreadyAssign.map((key) => { return key.roomId })
            await roomsDb.removeMainRoom(parentId);
            await Promise.all(ids.map((room) => roomsDb.unLockRoom(room)));
    } else {
        if (checkIfUserAlreadyAssign.length > 0) {
            const ids = checkIfUserAlreadyAssign.map((key) => { return key.roomId })
            await Promise.all(ids.map((room) => roomsDb.unLockRoom(room)));
           await roomsDb.removeMainRoom(parentId)
           await Promise.all(roomDetails.map((room) => roomsDb.assignMainRoom(parentId, room.roomId)));
           await Promise.all(roomDetails.map((room) => roomsDb.lockRoom(room.roomId)));
        } else {
            await Promise.all(roomDetails.map((room) => roomsDb.assignMainRoom(parentId, room.roomId)));
            await Promise.all(roomDetails.map((room) => roomsDb.lockRoom(room.roomId)));
        }
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