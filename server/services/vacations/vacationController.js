const router = require("express").Router();
const vacationService = require("./vacationService")
const uuid = require("uuid").v4;
const ErrorMessage = require("../../serverLogs/errorMessage");
const ErrorType = require("../../serverLogs/errorType");

router.post("/", async (req, res, next) => {
    const vacationId = uuid();
    let vacationDetails = req.body

    try {
      await vacationService.addVacation(vacationDetails,vacationId)
      res.json("החופשה נוספה בהצלחה")
    } catch (error) {
      // Wrap with ErrorType so errorHandler returns a proper 500 response
      // (errorHandler dereferences e.errorType, so a raw Error would crash it
      // and the client would never get a clean failure).
      return next(new ErrorMessage(ErrorType.SQL_ERROR, "Failed to create vacation", error));
    }
});


// Update an existing vacation in place. The vacation_id comes from the body (the
// id being edited) — no UUID is generated and no tenant DB is created, so editing
// updates the existing vacation instead of duplicating it. Returns the refreshed
// part rows so the client can update its state without a manual refresh.
router.put("/", async (req, res, next) => {
  const payload = req.body
  try {
    const details = await vacationService.updateVacation(payload, payload.vacation_id)
    res.json({ message: "החופשה עודכנה בהצלחה", details })
  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to update vacation", error));
  }
});

router.get("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  try {
   const vacations = await vacationService.getVacations()
   const vacationsDate = await vacationService.getVacationDates(vacationId)
   const allVacationDates = await vacationService.getAllVacationDates()
   res.send({vacations,vacationsDate,allVacationDates})
  } catch (error) {
    return next(error);
  }
});

// Delete a single vacation part (vacation_date row) by id. The service blocks
// the delete when the part is still in use and returns { deleted:false, blockers }
// listing the families/guests assigned to it — a valid business response, not an
// error, so it comes back as a normal 200 for the client to branch on.
router.delete("/part/:id", async (req, res, next) => {
  const partId = req.params.id
  try {
    const result = await vacationService.deleteVacationPart(partId)
    res.json(result)
  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_ERROR, "Failed to delete vacation part", error));
  }
});










module.exports = router;
