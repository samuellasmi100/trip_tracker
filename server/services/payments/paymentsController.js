const router = require("express").Router();
const paymentsService = require("./paymentsService")
const uuid = require("uuid").v4;


router.post("/", async (req, res, next) => {
  const paymentsDetails = req.body
  try {
    const response = await paymentsService.addPayments(paymentsDetails)
    res.send("hello")

  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const familyId = req.params.id
  try {
    const response = await paymentsService.getPayments(familyId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});



module.exports = router;
