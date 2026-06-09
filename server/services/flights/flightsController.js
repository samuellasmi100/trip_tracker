const router = require("express").Router();
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");
const flightsService = require("./flightsService")
const uuid = require("uuid").v4;



// Group-flights bulk apply. Two path segments, so it never collides with the
// single POST "/:id" below. Body: { familyId, people: [{user_id, flying,
// direction}], legs: {6 fields} }.
router.post("/:vacationId/bulk", async (req, res, next) => {
  const vacationId = req.params.vacationId
  const { familyId, people, legs } = req.body
  if (!familyId || !Array.isArray(people) || people.length === 0) {
    return res.status(400).json({ error: "BAD_REQUEST", message: "familyId and people are required" })
  }
  try {
    const result = await flightsService.applyFlightsBulk(familyId, people, legs || {}, vacationId)
    res.send(result)
  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle bulk flights request", error));
  }
});

router.post("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const flightsDetails = req.body
  try {
    await flightsService.addFlightsDetails(flightsDetails,vacationId)
    res.send("נתוני טיסה התקבלו בהצלחה")

  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle flights request", error));
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
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle flights request", error));
  }
});

// Must be registered BEFORE /:id/... so Express matches the literal "family" segment
router.get("/family/:familyId/:vacationId", async (req, res, next) => {
  const { familyId, vacationId } = req.params;
  try {
    const response = await flightsService.getFamilyFlightsWithNames(familyId, vacationId);
    res.send(response);
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
