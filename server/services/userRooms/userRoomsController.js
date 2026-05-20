const router = require("express").Router();
const userRoomsService = require("./userRoomsService")
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");
const { parseDateLoose } = require("../../utils/dateNormalize");



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

// Remove a single family/room pairing — frees the room for the dates the
// family held it without touching the family's other room bookings.
router.post("/remove", async (req, res, next) => {
  const { vacationId, familyId, roomId } = req.body;
  try {
    await userRoomsService.removeFamilyFromRoom(vacationId, familyId, roomId);
    res.send("המשפחה הוסרה מהחדר בהצלחה");
  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to remove family from room", error));
  }
});

router.post("/", async (req, res, next) => {
  const roomDetails = req.body.selectedRooms
  const familyId = req.body.familyId
  let startDate = req.body.startDate
  let endDate = req.body.endDate
  const vacationId = req.body.vacationId

  // Date validation + normalization. `families.start_date`/`end_date` are
  // varchar(45) and the in-app GuestWizard stores them as DD/MM/YYYY (Israeli
  // display format); Excel-imported families have ISO. `room_taken` only
  // accepts ISO (DATE NOT NULL). parseDateLoose tolerates both incoming
  // shapes and returns strict ISO — or null, which we map to INVALID_DATES.
  // An "unassign all" call (roomDetails empty) doesn't need dates, so skip
  // the check in that case.
  const isUnassignAll = Array.isArray(roomDetails) && roomDetails.length === 0;
  if (!isUnassignAll) {
    const sd = parseDateLoose(startDate);
    const ed = parseDateLoose(endDate);
    if (!sd || !ed) {
      return res.status(400).json({
        error: 'INVALID_DATES',
        message: 'תאריכי שהייה חסרים או לא תקינים',
      });
    }
    if (new Date(ed).getTime() <= new Date(sd).getTime()) {
      return res.status(400).json({
        error: 'INVALID_RANGE',
        message: 'תאריך סיום חייב להיות אחרי תאריך התחלה',
      });
    }
    // Replace with the normalized ISO values for everything downstream
    // (the overlap probe and the INSERT into room_taken).
    startDate = sd;
    endDate = ed;
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
