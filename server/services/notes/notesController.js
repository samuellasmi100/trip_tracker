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
  const roomDetails = req.body
  try {
    const response = await roomsService.assignMainRoom(roomDetails)
    res.send("hello")

  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const parentId = req.params.id
  try {
    const response = await roomsService.getParentRoom(parentId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});
// router.get("/child/:id", async (req, res, next) => {
//   try {
//     const parentId = req.params.id
//     const response = await userService.getChildByParentId(parentId)
//     res.send(response)

//   } catch (error) {
//     return next(error);
//   }
// });

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
