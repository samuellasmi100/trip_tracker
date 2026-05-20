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


router.put("/", async (req, res, next) => {
 
  try {
   
  } catch (error) {
    return next(new ErrorMessage(ErrorType.SQL_GENERAL_ERROR, "Failed to handle vacation request", error));
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










module.exports = router;
