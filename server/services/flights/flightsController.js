const router = require("express").Router();
const flightsService = require("./flightsService")
const uuid = require("uuid").v4;



router.post("/", async (req, res, next) => {
  const flightsDetails = req.body
  try {
    await flightsService.addParentFlightsDetails(flightsDetails)
    res.send("נתוני טיסה התקבלו בהצלחה")

  } catch (error) {
    return next(error);
  }
});

router.post("/child", async (req, res, next) => {
  const paymentsDetails = req.body
  try {
    const response = await flightsService.addChildFlightsDetails(paymentsDetails)
    res.send("hello")

  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const parentId = req.params.id
  const flightsDetails = req.body
  flightsDetails.parentId = parentId
  try {
     await flightsService.updateParentFlightsDetails(flightsDetails)
    res.send("נתוני טיסה עודכנו בהצלחה")

  } catch (error) {
    return next(error);
  }
});
router.put("/child/:id", async (req, res, next) => {

  const childId = req.params.id
  const flightsDetails = req.body
  flightsDetails.childId = childId
  try {
     await flightsService.updateChildrenFlightsDetails(flightsDetails)
    res.send("נתוני טיסה עודכנו בהצלחה")

  } catch (error) {
    return next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  const parentId = req.params.id
  try {
    const response = await flightsService.getParentDetails(parentId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/child/:id", async (req, res, next) => {

  const childId = req.params.id
  try {
    const response = await flightsService.getChildDetails(childId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});


module.exports = router;
