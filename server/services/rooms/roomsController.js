const router = require("express").Router();
const roomsService = require("./roomsService")
const uuid = require("uuid").v4;


router.get("/:vacationId/:startDate/:endDate", async (req, res, next) => {
  const vacationId = req.params.vacationId
  const startData = req.params.startDate
  const endDate = req.params.endDate

  try {
    const response = await roomsService.getRoomAvailable(vacationId,startData,endDate)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
  
  try {
    const response = await roomsService.getAll(vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/room_available/:id/:startDate/:endDate", async (req, res, next) => {
  const vacationId = req.params.id
  const startDate = req.params.startDate
  const endDate = req.params.endDate
  try {
    const response = await roomsService.getRoomAvailableDates(vacationId,startDate,endDate)
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

router.put("/:id", async (req, res, next) => {
  const roomData = req.body.form
  const vacationId = req.params.id
  try {
   await roomsService.updateRoom(roomData,vacationId)
   const response = await roomsService.getAll(vacationId)
   res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
