const router = require("express").Router();
const userRoomsService = require("./userRoomsService")
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");



// Move a family's booking from one room to another room
// Also moves all guest assignments to the new room
router.post("/move", async (req, res, next) => {
  const { vacationId, familyId, fromRoomId, toRoomId } = req.body;
  try {
    await userRoomsService.moveRoom(vacationId, familyId, fromRoomId, toRoomId);
    res.send("החדר הועבר בהצלחה");
  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to move room", error));
  }
});

router.post("/", async (req, res, next) => {
  const roomDetails = req.body.selectedRooms
  const familyId = req.body.familyId
  const startDate = req.body.startDate
  const endDate = req.body.endDate
  const vacationId = req.body.vacationId

  // Date validation runs BEFORE we touch the DB. room_taken has start_date /
  // end_date as DATE NOT NULL, and historically the service silently failed
  // when given undefined/null/unparseable values. Reject early with a clear
  // Hebrew message instead. An "unassign all" call (roomDetails empty) does
  // not need dates, so skip the check in that case.
  const isUnassignAll = Array.isArray(roomDetails) && roomDetails.length === 0;
  if (!isUnassignAll) {
    const sd = startDate ? new Date(startDate) : null;
    const ed = endDate ? new Date(endDate) : null;
    if (!sd || !ed || isNaN(sd.getTime()) || isNaN(ed.getTime())) {
      return res.status(400).json({
        error: 'INVALID_DATES',
        message: 'תאריכי שהייה חסרים או לא תקינים',
      });
    }
    if (ed.getTime() <= sd.getTime()) {
      return res.status(400).json({
        error: 'INVALID_RANGE',
        message: 'תאריך סיום חייב להיות אחרי תאריך התחלה',
      });
    }
  }

  try {
    await userRoomsService.assignMainRoom(roomDetails,familyId,vacationId,startDate,endDate)
    res.send("שיוך החדרים עבר בהצלחה")
  } catch (error) {
    // Overlap conflicts get a dedicated 409 so the client can distinguish
    // "room already taken" from a real server failure.
    if (error && error.code === userRoomsService.ROOM_OVERLAP) {
      return res.status(409).json({
        error: 'ROOM_OVERLAP',
        roomId: error.roomId,
        message: 'החדר כבר תפוס בתאריכים אלה',
      });
    }
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to assign room", error));
  }
});

router.get("/users/:id/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
  const familyId = req.params.id
  try {
    const response = await userRoomsService.getUsersChosenRoom(familyId,vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/user/:id/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
  const userId = req.params.id
  try {
    const response = await userRoomsService.getChosenRoom(userId,vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/:id/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
  const familyId = req.params.id
  try {
    const response = await userRoomsService.getFamilyRoom(familyId,vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.post("/room", async (req, res, next) => {
  const form = req.body.form
  let userId = form.user_id
  const roomId = req.body.selectedChildRoomId
  const familyId = form.family_id
  const vacationId = req.body.vacationId

  try {
    const result = await userRoomsService.assignRoom(userId,roomId,familyId,vacationId)
    const response = await userRoomsService.getChosenRoom(userId,vacationId)
    response.roomAssignStatus=result
    res.send(response)

  } catch (error) {
    return next(error);
  }
});


router.post("/room/parent/:id", async (req, res, next) => {
  const form = req.body.dataToSend
  let userId = form.userId
  const roomId = form.roomsId
  const familyId = form.familyId
  const status = form.status
  const vacationId = req.params.id
  try {
    const result = await userRoomsService.assignRoom(userId,roomId,familyId,vacationId,status)
    const response = await userRoomsService.getFamilyRoom(familyId,vacationId)
    response.roomAssignStatus= result
    res.send(response)

  } catch (error) {
    return next(error);
  }
});
module.exports = router;
