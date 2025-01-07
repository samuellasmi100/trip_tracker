const router = require("express").Router();
const budgetsService = require("./budgetsService")
const uuid = require("uuid").v4;


router.get("/category/:id", async (req, res, next) => {
  const vacationId = req.params.id
  try {
    const response = await budgetsService.getCategory(vacationId)
    res.send(response)

  } catch (error) {
    return next(error);
  }
});

router.get("/sub_category/:id/:category_id", async (req, res, next) => {
    const vacationId = req.params.id
    const categoryId = req.params.category_id
    try {
      const response = await budgetsService.getSubCategory(vacationId,categoryId)
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });

  router.post("/future_expenses/:id", async (req, res, next) => {
     const vacationId = req.params.id
     const futureExpensesDetails = req.body
    try {
      const response = await budgetsService.addFutureExpenses(vacationId,futureExpensesDetails)
      res.send("response")
  
    } catch (error) {
      return next(error);
    }
  });

module.exports = router;
