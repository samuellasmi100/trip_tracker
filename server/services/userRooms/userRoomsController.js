const router = require("express").Router();
const userRoomsService = require("./userRoomsService")



router.post("/", async (req, res, next) => {
  const roomDetails = req.body.selectedRooms
  const familyId = req.body.familyId
  const startDate = req.body.startDate
  const endDate = req.body.endDate
  const vacationId = req.body.vacationId
  try {
    const response = await userRoomsService.assignMainRoom(roomDetails,familyId,vacationId,startDate,endDate)
    res.send("שיוך החדרים עבר בהצלחה")

  } catch (error) {
    return next(error);
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
    await userRoomsService.assignRoom(userId,roomId,familyId,vacationId)
    const response = await userRoomsService.getChosenRoom(userId,vacationId)
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
    await userRoomsService.assignRoom(userId,roomId,familyId,vacationId,status)
    const response = await userRoomsService.getFamilyRoom(familyId,vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});
module.exports = router;
