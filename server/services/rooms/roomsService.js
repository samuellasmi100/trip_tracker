const roomsDb = require("./roomsDb")

const getAll = async () => {
    return roomsDb.getAll()
}

const assignMainRoom = async (roomDetails, parentId) => {
    const checkIfUserAlrwadyAssign = await getParentRoom(parentId)

    if (roomDetails.length === 0) {
        const ids = checkIfUserAlrwadyAssign.map((key) => { return key.roomId })
            await roomsDb.removeMainRoom(parentId);
            await Promise.all(ids.map((room) => roomsDb.unLockRoom(room)));
    } else {
        if (checkIfUserAlrwadyAssign.length > 0) {
            console.log(roomDetails,'roomDetails')
            const ids = checkIfUserAlrwadyAssign.map((key) => { return key.roomId })
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