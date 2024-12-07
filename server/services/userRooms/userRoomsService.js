const userRoomsDb = require("./userRoomsDb")


const assignMainRoom = async (roomDetails,familyId,vacationId,startDate,endDate) => {
 console.log(roomDetails,familyId,vacationId,startDate,endDate)
    const checkIfUserAlreadyAssign = await userRoomsDb.getFamilyRoom(familyId,vacationId)
    console.log(checkIfUserAlreadyAssign)
    // const ge = await userRoomsDb.getFamilyRoom(familyId,vacationId)
    if(roomDetails.length === 0){
        if(checkIfUserAlreadyAssign.length > 0){
            const ids = checkIfUserAlreadyAssign.map((key) => { return key.rooms_id })
            console.log(ids)
            // await userRoomsDb.removeMainRoom(familyId,vacationId);
            // await userRoomsDb.removeUserAssignMainRoom(familyId);
            // await Promise.all(ids.map((room) => userRoomsDb.unLockRoom(room)));
        }
    }else {

        // if(checkIfUserAlreadyAssign.length === 0){
            await Promise.all(roomDetails.map((room) => userRoomsDb.assignMainRoom(vacationId,familyId,room.rooms_id,startDate,endDate)));
            // await Promise.all(roomDetails.map((room) => userRoomsDb.lockRoom(room.roomId)));
        // }else {
            // const ids = checkIfUserAlreadyAssign.map((key) => { return key.roomId })
            // const userIds = roomDetails.map((key) => { return key.roomId })
            // const result = ids.filter(item => !userIds.includes(item));
            // await Promise.all(result.map((room) => userRoomsDb.removeAllUserAssignRoom(familyId, room)));
            // await Promise.all(ids.map((room) => userRoomsDb.unLockRoom(room)));
            // await userRoomsDb.removeMainRoom(familyId)
            // await Promise.all(roomDetails.map((room) => userRoomsDb.assignMainRoom(familyId, room.roomId)));
            // await Promise.all(roomDetails.map((room) => userRoomsDb.lockRoom(room.roomId)));
        // }
    }

}

const assignGroupUserRoom = async (selectedRoomList) => {
    await Promise.all(selectedRoomList.map((room) => userRoomsDb.assignRoom(room.userId,room.roomId,room.familyId)));
}

const getFamilyRoom = async (id,vacationId) => {
    const familyRooms = await userRoomsDb.getFamilyRoom(id,vacationId) 
    const userAssignRoom = await userRoomsDb.getAllUserRooms(id,vacationId)
    return {familyRooms,userAssignRoom}
}

const assignRoom = async (userId,roomId,familyId,status,vacationId) => {
    return await userRoomsDb.assignRoom(userId,roomId,familyId,status,vacationId)
}

const updateAssignRoom = async (userId,roomId) => {
    return await userRoomsDb.updateAssignRoom(userId,roomId)
}

const getChossenRoom = async (id) => {
    return await userRoomsDb.getChossenRoom(id)
}

module.exports = {
    assignMainRoom,
    getFamilyRoom,
    assignRoom,
    getChossenRoom,
    updateAssignRoom,
    assignGroupUserRoom,
}