const router = require("express").Router();
const notesService = require("./notesService")
const uuid = require("uuid").v4;

router.get("/child/:id", async (req, res, next) => {
  try {
    const childId = req.params.id
    const response = await notesService.getChildNote(childId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});
router.get("/parent/:id", async (req, res, next) => {
  try {
    const childId = req.params.id
    const response = await notesService.getChildNote(childId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});
router.get("/", async (req, res, next) => {
  try {
    const response = await notesService.getAll()
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  const roomDetails = req.body
  try {
    const response = await notesService.addParentNotes(roomDetails)
    res.send("hello")

  } catch (error) {
    return next(error);
  }
});

router.post("/child", async (req, res, next) => {
  const roomDetails = req.body
  try {
    const response = await notesService.addChildNotes(roomDetails)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const parentId = req.params.id
  try {
    const response = await notesService.getParentNote(parentId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});


// router.put("/", async (req, res, next) => {
//    const userData = req.body
//   try {
//    await userService.updateParentUser(userData)
//    res.send("העדכון עבר בהצלחה")
//   } catch (error) {
//     return next(error);
//   }
// });


module.exports = router;
