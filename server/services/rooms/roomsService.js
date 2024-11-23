const roomsDb = require("./roomsDb")

const getAll = async () => {
    return roomsDb.getAll()
}

const assignMainRoom = async (roomDetails, familyId) => {
    const checkIfUserAlreadyAssign = await roomsDb.getFamilyRoom(familyId)
    if(roomDetails.length === 0){
        if(checkIfUserAlreadyAssign.length > 0){
            const ids = checkIfUserAlreadyAssign.map((key) => { return key.roomId })
            await roomsDb.removeMainRoom(familyId);
            await roomsDb.removeUserAssignMainRoom(familyId);
            await Promise.all(ids.map((room) => roomsDb.unLockRoom(room)));
        }
    }else {
        if(checkIfUserAlreadyAssign.length === 0){
            await Promise.all(roomDetails.map((room) => roomsDb.assignMainRoom(familyId,room.roomId)));
            await Promise.all(roomDetails.map((room) => roomsDb.lockRoom(room.roomId)));
        }else {
            const ids = checkIfUserAlreadyAssign.map((key) => { return key.roomId })
            const userIds = roomDetails.map((key) => { return key.roomId })
            const result = ids.filter(item => !userIds.includes(item));
            await Promise.all(result.map((room) => roomsDb.removeUserAssignMainRoomOfUser(familyId, room)));
            await Promise.all(ids.map((room) => roomsDb.unLockRoom(room)));
            await roomsDb.removeMainRoom(familyId)
            await Promise.all(roomDetails.map((room) => roomsDb.assignMainRoom(familyId, room.roomId)));
            await Promise.all(roomDetails.map((room) => roomsDb.lockRoom(room.roomId)));
        }
    }

}

const getFamilyRoom = async (id) => {
    return roomsDb.getFamilyRoom(id)
}

const assignRoom = async (userId,roomId,assignRoom,familyId) => {
    return roomsDb.assignRoom(userId,roomId,assignRoom,familyId)
}

const updateAssignRoom = async (userId,roomId,assignRoom,familyId) => {
    return roomsDb.updateAssignRoom(userId,roomId,assignRoom,familyId)
}

const getChossenRoom = async (id,type) => {
    return roomsDb.getChossenRoom(id,type)
}

module.exports = {
    getAll,
    assignMainRoom,
    getFamilyRoom,
    assignRoom,
    getChossenRoom,
    updateAssignRoom
}