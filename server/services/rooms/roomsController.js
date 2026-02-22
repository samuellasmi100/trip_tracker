const router = require("express").Router();
const roomsService = require("./roomsService")

// IMPORTANT: Static-prefix routes must come before param routes (/:vacationId)
// otherwise Express matches e.g. "/count" as /:vacationId with vacationId="count".

// Full board data: rooms + bookings + guest assignments + all guests
router.get("/board/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId;
  try {
    const response = await roomsService.getBoardData(vacationId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.get("/count/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
  try {
    const response = await roomsService.getRoomDetailsWithCounts(vacationId)
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
