const router = require("express").Router();
const flightsService = require("./flightsService")
const uuid = require("uuid").v4;



router.post("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const flightsDetails = req.body
  try {
    await flightsService.addFlightsDetails(flightsDetails,vacationId)
    res.send("נתוני טיסה התקבלו בהצלחה")

  } catch (error) {
    return next(error);
  }
});

router.put("/:id/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId

  const userId = req.params.id
  const flightsDetails = req.body
  flightsDetails.user_id = userId
  try {
     await flightsService.updateFlightsDetails(flightsDetails,vacationId)
    res.send("נתוני טיסה עודכנו בהצלחה")

  } catch (error) {
    return next(error);
  }
});

router.get("/:id/:familyId/:isInGroup/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
  const userId = req.params.id
  const familyId = req.params.familyId
  const isInGroup = req.params.isInGroup
  try {
    const response = await flightsService.getFlightsDetails(userId,familyId,isInGroup,vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("family/:id", async (req, res, next) => {
  const familyId = req.params.id
  try {
    const response = await flightsService.getFlightsByFamily(familyId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
