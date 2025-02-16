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

  router.get("/future_expenses/:id", async (req, res, next) => {
    const vacationId = req.params.id
    try {
      const response = await budgetsService.getFutureExpenses(vacationId)
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });

  router.get("/expenses/:id", async (req, res, next) => {
    const vacationId = req.params.id
    try {
      const response = await budgetsService.getExpenses(vacationId)
      res.send(response)
  
    } catch (error) {
      return next(error);
    }
  });

  router.post("/future_expenses/:id", async (req, res, next) => {
     const vacationId = req.params.id
     const futureExpensesDetails = req.body
     const ifFutureExpense = true
    try {
      const response = await budgetsService.addFutureExpenses(vacationId,futureExpensesDetails,ifFutureExpense)
      res.send("response")
  
    } catch (error) {
      return next(error);
    }
  });

  router.post("/expenses/:id", async (req, res, next) => {
    const vacationId = req.params.id
    const futureExpensesDetails = req.body
    const ifFutureExpense = false
   try {
     const response = await budgetsService.addExpenses(vacationId,futureExpensesDetails,ifFutureExpense)
     res.send("response")
 
   } catch (error) {
     return next(error);
   }
 });

 router.put("/expenses/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const futureExpensesDetails = req.body
 try {
   const response = await budgetsService.updateExpensesAndFutureExpenses(vacationId,futureExpensesDetails)
   res.send("response")

 } catch (error) {
   return next(error);
 }
});
router.put("/status_expenses/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const expensesId = req.body.id

 try {
   const response = await budgetsService.updateExpensesStatus(vacationId,expensesId)
   res.send("response")

 } catch (error) {
   return next(error);
 }
});
module.exports = router;
