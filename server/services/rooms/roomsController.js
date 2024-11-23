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

router.post("/", async (req, res, next) => {
  const roomDetails = req.body.selectedRooms
  const familyId = req.body.familyId

  try {
    const response = await roomsService.assignMainRoom(roomDetails,familyId)

    res.send("שיוך החדרים עבר בהצלחה")

  } catch (error) {
    return next(error);
  }
});

router.get("/room:childId/:parentId", async (req, res, next) => {

  let userId = req.params.childId === "null" ? req.params.parentId : req.params.childId
  let type = req.params.childId === "null" ? "parent" : "child"

  try {
    const response = await roomsService.getChossenRoom(userId,type)
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
  let userId 
  let type
  if(form.child_id === null){
   userId = form.parent_id
   type="parent"
  }else {
    userId = form.child_id
    type = "child"
  }
  const roomId = req.body.selectedChildRoomId
  const familyId = form.family_id
  try {
    await roomsService.assignRoom(userId,roomId,type,familyId)
    const response = await roomsService.getChossenRoom(userId,type)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.put("/room", async (req, res, next) => {
  const form = req.body.form
  let userId 
  let type
  if(form.child_id === null){
   userId = form.parent_id
   type="parent"
  }else {
    userId = form.child_id
    type = "child"
  }
  const roomId = req.body.selectedChildRoomId
  const familyId = form.family_id

  try {
    await roomsService.updateAssignRoom(userId,roomId,type,familyId)
    const response = await roomsService.getChossenRoom(userId,type)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
