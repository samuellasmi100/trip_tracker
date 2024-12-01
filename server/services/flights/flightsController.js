const router = require("express").Router();
const flightsService = require("./flightsService")
const uuid = require("uuid").v4;



router.post("/", async (req, res, next) => {
  const flightsDetails = req.body
  try {
    await flightsService.addFlightsDetails(flightsDetails)
    res.send("נתוני טיסה התקבלו בהצלחה")

  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const userId = req.params.id
  const flightsDetails = req.body
  flightsDetails.user_id = userId
  try {
     await flightsService.updateFlightsDetails(flightsDetails)
    res.send("נתוני טיסה עודכנו בהצלחה")

  } catch (error) {
    return next(error);
  }
});

router.get("/:id/:familyId/:isInGroup", async (req, res, next) => {
  const userId = req.params.id
  const familyId = req.params.familyId
  const isInGroup = req.params.isInGroup
  try {
    const response = await flightsService.getFlightsDetails(userId,familyId,isInGroup)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("family/:id", async (req, res, next) => {
  const familyId = req.params.id
  try {
    const response = await flightsService.getFlightsByFamily(familyId)
    console.log(response)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
