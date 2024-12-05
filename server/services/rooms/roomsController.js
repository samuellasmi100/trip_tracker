const router = require("express").Router();
const roomsService = require("./roomsService")
const uuid = require("uuid").v4;


router.get("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  try {
    const response = await roomsService.getAll(vacationId)
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

  try {
   
  } catch (error) {
    return next(error);
  }
});

router.put("/", async (req, res, next) => {
  const roomData = req.body.form

  try {
   await roomsService.updateRoom(roomData)
   let response = await roomsService.getRoomDetailsWithCounts()
   res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
