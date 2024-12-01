const router = require("express").Router();
const roomsService = require("./roomsService")
const uuid = require("uuid").v4;


router.get("/", async (req, res, next) => {
  try {
    const response = await roomsService.getAll()
    res.send(response)

  } catch (error) {
    return next(error);
  }
});
router.get("/count", async (req, res, next) => {
  try {
    const response = await roomsService.getRoomDetailsWithCounts()
    res.send(response)

  } catch (error) {
    return next(error);
  }
});
router.post("/", async (req, res, next) => {
  console.log(req.body)
  const roomDetails = req.body.selectedRooms
  const familyId = req.body.familyId
  console.log(familyId)
  console.log(roomDetails)
  try {
    const response = await roomsService.assignMainRoom(roomDetails,familyId)
    res.send("שיוך החדרים עבר בהצלחה")

  } catch (error) {
    return next(error);
  }
});

router.get("/room/:id", async (req, res, next) => {
  let userId = req.params.id
  try {
    const response = await roomsService.getChossenRoom(userId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const familyId = req.params.id
  try {
    const response = await roomsService.getFamilyRoom(familyId)
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
    await roomsService.assignRoom(userId,roomId,familyId)
    const response = await roomsService.getChossenRoom(userId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.post("/room/parent", async (req, res, next) => {
  const form = req.body.dataTosend
  let userId = form.userId
  const roomId = form.roomId
  const familyId = form.familyId
  const status = form.status
  try {
    await roomsService.assignRoom(userId,roomId,familyId,status)
    const response = await roomsService.getFamilyRoom(familyId)
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
    await roomsService.updateAssignRoom(userId,roomId)
    const response = await roomsService.getChossenRoom(userId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
