const userRoomsDb = require("./userRoomsDb")
const connection = require("../../db/connection-wrapper")
const userRoomQuery = require("../../sql/query/userRoomQuery")

// Sentinel error code surfaced by assignMainRoom when a requested booking
// would overlap an existing one in the same room. The controller maps this
// to HTTP 409 so the client can show a specific Hebrew "room is taken" toast
// instead of a generic failure.
const ROOM_OVERLAP = 'ROOM_OVERLAP';

const assignMainRoom = async (roomDetails, familyId, vacationId, startDate, endDate) => {
  // All reads + writes for this assignment happen inside one transaction:
  // the overlap probe SELECT ... FOR UPDATE locks any colliding rows so a
  // second concurrent request for the same room can't slip past the check
  // between our SELECT and our INSERT.
  return await connection.withTransaction(async (tx) => {
    const existing = await tx.executeWithParameters(
      userRoomQuery.getFamilyRoomIds(vacationId),
      [familyId]
    );

    // Empty roomDetails = "unassign this family from every room". Preserved
    // from the previous behaviour.
    if (roomDetails.length === 0) {
      if (existing.length > 0) {
        await tx.executeWithParameters(
          userRoomQuery.removeMainRoom(vacationId),
          [familyId]
        );
        await tx.executeWithParameters(
          userRoomQuery.removeAllUserAssignRoom(vacationId),
          [familyId]
        );
      }
      return;
    }

    // Diff existing vs requested — same as before, just done with the tx's
    // own connection so the FOR UPDATE locks apply.
    const existingIds = existing.map(r => r.rooms_id);
    const requestedIds = roomDetails.map(d => d.rooms_id);
    const roomsToRemove = existingIds.filter(id => !requestedIds.includes(id));
    const roomsToAdd = requestedIds.filter(id => !existingIds.includes(id));

    // 1. Overlap check for every NEW room. Rooms the family is already in are
    //    unchanged — no point re-checking them against themselves. If any one
    //    new room conflicts, throw before any write, so the transaction
    //    rolls back any prior removes we may have already issued.
    for (const roomId of roomsToAdd) {
      const conflicts = await tx.executeWithParameters(
        userRoomQuery.findOverlappingBookings(vacationId),
        [roomId, startDate, endDate]
      );
      if (conflicts.length > 0) {
        const err = new Error(`Room ${roomId} is already booked in the requested date range`);
        err.code = ROOM_OVERLAP;
        err.roomId = roomId;
        err.conflicts = conflicts;
        throw err;
      }
    }

    // 2. Apply removes (sequentially, on the tx connection).
    for (const roomId of roomsToRemove) {
      await tx.executeWithParameters(
        userRoomQuery.removeMainRoomByRoomId(vacationId),
        [roomId, familyId]
      );
      await tx.executeWithParameters(
        userRoomQuery.removeAllUserAssignFromRoomId(vacationId),
        [roomId, familyId]
      );
    }

    // 3. Apply inserts.
    for (const roomId of roomsToAdd) {
      await tx.executeWithParameters(
        userRoomQuery.assignMainRoom(vacationId),
        [familyId, roomId, startDate, endDate]
      );
    }
  });
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
            const familyRoom = await userRoomsDb.getFamilyRoom(familyId, vacationId)
            const isRoomExists = familyRoom.some(room => room.rooms_id === roomId);
            if(isRoomExists){
                const response = await getChosenRoom(userId, vacationId)
                if (response.length > 0) {
                    await userRoomsDb.updateAssignRoom(userId, roomId, vacationId)
                } else {
                    await userRoomsDb.assignRoom(userId, roomId, familyId, vacationId)
                }
                return true
            }else {
                return false
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

// "What dates does this family currently hold across its rooms?" — single-row
// probe used by the family/guest edit endpoints to enforce the
// "no date change while assigned" rule. Returns [] when unassigned, or one
// row with ISO-formatted start_date / end_date otherwise.
const getBookingDatesForFamily = (vacationId, familyId) => {
    return userRoomsDb.getBookingDatesForFamily(vacationId, familyId);
}
const moveRoom = async (vacationId, familyId, fromRoomId, toRoomId) => {
    return await userRoomsDb.moveRoom(vacationId, familyId, fromRoomId, toRoomId);
};

// Remove ONE specific room from a family. Drops the booking row in room_taken
// and any guest assignments the family had in that room, atomically. Other
// rooms the family holds are untouched, so this differs from the empty-array
// "unassign all" branch of assignMainRoom.
const removeFamilyFromRoom = async (vacationId, familyId, roomId) => {
    return await connection.withTransaction(async (tx) => {
        await tx.executeWithParameters(
            userRoomQuery.removeMainRoomByRoomId(vacationId),
            [roomId, familyId]
        );
        await tx.executeWithParameters(
            userRoomQuery.removeAllUserAssignFromRoomId(vacationId),
            [roomId, familyId]
        );
    });
};

module.exports = {
    assignMainRoom,
    getFamilyRoom,
    assignRoom,
    getChosenRoom,
    assignGroupUserRoom,
    getUsersChosenRoom,
    updateStartEndAndDate,
    getAllChosenRoom,
    moveRoom,
    removeFamilyFromRoom,
    getBookingDatesForFamily,
    ROOM_OVERLAP,
}