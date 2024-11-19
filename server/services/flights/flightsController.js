const router = require("express").Router();
const flightsService = require("./flightsService")
const uuid = require("uuid").v4;


// router.get("/", async (req, res, next) => {
//   try {
//     const response = await flightsService.getAll()
//     res.send(response)

//   } catch (error) {
//     return next(error);
//   }
// });

router.post("/", async (req, res, next) => {
  const fligthsDetails = req.body
  try {
    const response = await flightsService.addParentFlightsDetails(fligthsDetails)
    res.send("hello")

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
  const fligthsDetails = req.body
  fligthsDetails.parentId = parentId
  try {
    const response = await flightsService.updateParentFlightsDetails(fligthsDetails)
    res.send("hello")

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
