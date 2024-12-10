const router = require("express").Router();
const staticService = require("./staticService")

router.get("/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
  try {
    const response = await staticService.getAllGuests(vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/main/:vacationId", async (req, res, next) => {
    const vacationId = req.params.vacationId
    try {
      const response = await staticService.getMainGuests(vacationId)
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });

module.exports = router;
