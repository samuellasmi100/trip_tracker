const router = require("express").Router();
const paymentsService = require("./paymentsService")
const uuid = require("uuid").v4;


router.post("/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const paymentsDetails = req.body
  try {
    const response = await paymentsService.addPayments(paymentsDetails,vacationId)
    res.send("hello")

  } catch (error) {
    return next(error);
  }
});

router.get("/:id/:vacationId", async (req, res, next) => {
  const familyId = req.params.id
  const vacationId = req.params.vacationId
  try {
    const response = await paymentsService.getPayments(familyId,vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
