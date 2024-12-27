const userRoomsDb = require("./userRoomsDb")


const assignMainRoom = async (roomDetails, familyId, vacationId, startDate, endDate,weekChosen) => {
    const checkIfUserAlreadyAssign = await userRoomsDb.getFamilyRoom(familyId, vacationId)
    if (roomDetails.length === 0) {
        if (checkIfUserAlreadyAssign.length > 0) {
            await userRoomsDb.removeMainRoom(familyId, vacationId)
            await userRoomsDb.removeAllUserAssignRoom(familyId, vacationId)
        }
    } else {
        if (checkIfUserAlreadyAssign.length === 0) {
            await Promise.all(roomDetails.map((room) => userRoomsDb.assignMainRoom(vacationId, familyId, room.rooms_id, startDate, endDate,weekChosen)));
        } else {
            const roomsToRemove = checkIfUserAlreadyAssign
            .filter(room => !roomDetails.some(detail => detail.rooms_id === room.rooms_id))
            .map(room => room.rooms_id);
          const roomsToAdd = roomDetails
            .filter(room => !checkIfUserAlreadyAssign.some(assign => assign.rooms_id === room.rooms_id))
            .map(room => room.rooms_id);
          if (roomsToRemove.length > 0) {
            await userRoomsDb.removeMainRoomByRoomId(familyId, vacationId,roomsToRemove[0])
            await userRoomsDb.removeAllUserAssignFromRoomId(familyId, vacationId,roomsToRemove[0])

          } else {
          }
          
          if (roomsToAdd.length > 0) {
            await Promise.all(roomsToAdd.map((room) => userRoomsDb.assignMainRoom(vacationId, familyId, roomsToAdd[0], startDate, endDate,weekChosen)));
          } else {
          }
        }
    }

}

const assignGroupUserRoom = async (selectedRoomList) => {
    await Promise.all(selectedRoomList.map((room) => userRoomsDb.assignRoom(room.userId, room.roomId, room.familyId)));
}

const getFamilyRoom = async (id, vacationId) => {
    const familyRooms = await userRoomsDb.getFamilyRoom(id, vacationId)
    const userAssignRoom = await userRoomsDb.getUsersChosenRoom(id, vacationId)
    return { familyRooms, userAssignRoom }
}

const assignRoom = async (userId, roomId, familyId, vacationId, status) => {
    if (status === undefined) {
        if (roomId === null) {
            await userRoomsDb.removeUserAssignMainRoom(userId, vacationId)
        } else {
            const response = await getChosenRoom(userId, vacationId)
            if (response.length > 0) {
                await userRoomsDb.updateAssignRoom(userId, roomId, vacationId)
            } else {
                await userRoomsDb.assignRoom(userId, roomId, familyId, vacationId)
            }
        }
    } else {
        if (status === false) {
            await userRoomsDb.removeUserAssignMainRoom(userId, vacationId)
        } else {
            const response = await getChosenRoom(userId, vacationId)
            if (response.length > 0) {
                await userRoomsDb.updateAssignRoom(userId, roomId, vacationId)
            } else {
                await userRoomsDb.assignRoom(userId, roomId, familyId, vacationId)
            }
        }

    }

}

const getChosenRoom = async (id, vacationId) => {
    return await userRoomsDb.getChosenRoom(id, vacationId)
}

const getAllChosenRoom = async (vacationId) => {
    return await userRoomsDb.getAllChosenRoom(vacationId)
}

const getUsersChosenRoom = async (id, vacationId) => {
    return await userRoomsDb.getUsersChosenRoom(id, vacationId)
}

const updateStartEndAndDate = (vacationId, familyId, startDate, endDate) => {
    return userRoomsDb.updateStartEndAndDate(vacationId, familyId, startDate, endDate)
}
module.exports = {
    assignMainRoom,
    getFamilyRoom,
    assignRoom,
    getChosenRoom,
    assignGroupUserRoom,
    getUsersChosenRoom,
    updateStartEndAndDate,
    getAllChosenRoom
}