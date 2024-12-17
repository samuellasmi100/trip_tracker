const router = require("express").Router();
const staticService = require("./staticService")

router.get("/user/:vacationId", async (req, res, next) => {
  const vacationId = req.params.vacationId
  try {
    const response = await staticService.getAllGuests(vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/user/main/:vacationId", async (req, res, next) => {
    const vacationId = req.params.vacationId
    try {
      const response = await staticService.getMainGuests(vacationId)
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });

  router.get("/flights/:vacationId", async (req, res, next) => {
    const vacationId = req.params.vacationId
    try {
      const response = await staticService.getFlightsDetails(vacationId)
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });

  router.get("/vacation/:vacationId", async (req, res, next) => {
    const vacationId = req.params.vacationId
    try {
      const response = await staticService.getVacationDetails(vacationId)
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });

  router.get("/payments/:vacationId", async (req, res, next) => {
    const vacationId = req.params.vacationId
    try {
      const response = await staticService.getPaymentsDetails(vacationId)
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });
  router.get("/payments/:vacationId/:userId", async (req, res, next) => {
    const vacationId = req.params.vacationId
    const userId = req.params.userId
    try {
      const response = await staticService.getUserPayments(vacationId,userId)
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });
module.exports = router;
