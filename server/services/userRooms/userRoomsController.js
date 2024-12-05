const router = require("express").Router();
const userRoomsService = require("./userRoomsService")
const uuid = require("uuid").v4;




router.post("/", async (req, res, next) => {
  const roomDetails = req.body.selectedRooms
  const familyId = req.body.familyId
  const dateChosen = req.body.dateChosen
  const vacationId = req.body.vacationId
  try {
    const response = await userRoomsService.assignMainRoom(roomDetails,familyId,dateChosen,vacationId)
    res.send("שיוך החדרים עבר בהצלחה")

  } catch (error) {
    return next(error);
  }
});

router.get("/room/:id", async (req, res, next) => {
  let userId = req.params.id
  try {
    const response = await userRoomsService.getChossenRoom(userId)
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
  try {
    await userRoomsService.assignRoom(userId,roomId,familyId)
    const response = await userRoomsService.getChossenRoom(userId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.post("/room/parent", async (req, res, next) => {
  const form = req.body.dataToSend
  let userId = form.userId
  const roomId = form.roomId
  const familyId = form.familyId
  const status = form.status
  try {
    await userRoomsService.assignRoom(userId,roomId,familyId,status)
    const response = await userRoomsService.getFamilyRoom(familyId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.put("/room", async (req, res, next) => {
  const form = req.body.form
  let userId = form.user_id
  const roomId = req.body.selectedChildRoomId

  try {
    await userRoomsService.updateAssignRoom(userId,roomId)
    const response = await userRoomsService.getChossenRoom(userId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
