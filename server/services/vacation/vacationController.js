const router = require("express").Router();
const vacationService = require("./vacationService")
const uuid = require("uuid").v4;

router.post("/", async (req, res, next) => {
    const vacationId = uuid();
    let vacationDetails = req.body
    console.log(vacationDetails)
    try {
      await vacationService.addVacation(vacationDetails,vacationId)
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

router.get("/", async (req, res, next) => {

  try {
   

  } catch (error) {
    return next(error);
  }
});









module.exports = router;
