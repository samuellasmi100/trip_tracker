const router = require("express").Router();
const vacationService = require("./vacationService")
const uuid = require("uuid").v4;

router.post("/", async (req, res, next) => {
    const vacationId = uuid();
    let vacationDetails = req.body

    try {
      await vacationService.addVacation(vacationDetails,vacationId)
      res.json("החופשה נוספה בהצלחה")
    } catch (error) {
      return next(error);
    }
});


router.put("/", async (req, res, next) => {
 
  try {
   
  } catch (error) {
    return next(error);
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
