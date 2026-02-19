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

 router.put("/future_expenses/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const futureExpensesDetails = req.body
 try {
   const response = await budgetsService.updateExpensesAndFutureExpenses(vacationId,futureExpensesDetails)
   res.send("response")

 } catch (error) {
   return next(error);
 }
});

router.put("/expenses/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const futureExpensesDetails = req.body
 try {
   const response = await budgetsService.updateExpenses(vacationId,futureExpensesDetails)
   res.send("response")

 } catch (error) {
   return next(error);
 }
});

router.put("/status_expenses/:id", async (req, res, next) => {
  const vacationId = req.params.id
  const expensesId = req.body.id
  const paymentStatus = req.body.paymentStatus
 try {
   const response = await budgetsService.updateExpensesStatus(vacationId,expensesId,paymentStatus)
   res.send("response")

 } catch (error) {
   return next(error);
 }
});

// === EXCHANGE RATES ===
router.get("/exchange_rates/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  try {
    const response = await budgetsService.getAllExchangeRates(vacationId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.put("/exchange_rates/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const { ccy, amount } = req.body;
  try {
    const response = await budgetsService.upsertExchangeRate(vacationId, ccy, amount);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

// === EXPENSE CATEGORY CRUD ===
router.post("/category/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const { name } = req.body;
  try {
    const response = await budgetsService.addCategory(vacationId, name);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.put("/category/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const { categoryId, name } = req.body;
  try {
    const response = await budgetsService.updateCategory(vacationId, categoryId, name);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.delete("/category/:id/:categoryId", async (req, res, next) => {
  const vacationId = req.params.id;
  const categoryId = req.params.categoryId;
  try {
    const response = await budgetsService.deleteCategory(vacationId, categoryId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

// === EXPENSE SUBCATEGORY CRUD ===
router.post("/sub_category/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const { categoryId, name } = req.body;
  try {
    const response = await budgetsService.addSubCategory(vacationId, categoryId, name);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.put("/sub_category/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const { subCategoryId, name, categoryId } = req.body;
  try {
    const response = await budgetsService.updateSubCategory(vacationId, subCategoryId, name, categoryId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.delete("/sub_category/:id/:subCategoryId/:categoryId", async (req, res, next) => {
  const vacationId = req.params.id;
  const subCategoryId = req.params.subCategoryId;
  const categoryId = req.params.categoryId;
  try {
    const response = await budgetsService.deleteSubCategory(vacationId, subCategoryId, categoryId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

// === INCOME CATEGORY CRUD ===
router.get("/income_category/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  try {
    const response = await budgetsService.getIncomeCategory(vacationId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.post("/income_category/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const { name } = req.body;
  try {
    const response = await budgetsService.addIncomeCategory(vacationId, name);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.put("/income_category/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const { categoryId, name } = req.body;
  try {
    const response = await budgetsService.updateIncomeCategory(vacationId, categoryId, name);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.delete("/income_category/:id/:categoryId", async (req, res, next) => {
  const vacationId = req.params.id;
  const categoryId = req.params.categoryId;
  try {
    const response = await budgetsService.deleteIncomeCategory(vacationId, categoryId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

// === INCOME SUBCATEGORY CRUD ===
router.get("/income_sub_category/:id/:category_id", async (req, res, next) => {
  const vacationId = req.params.id;
  const categoryId = req.params.category_id;
  try {
    const response = await budgetsService.getIncomeSubCategory(vacationId, categoryId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.post("/income_sub_category/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const { categoryId, name } = req.body;
  try {
    const response = await budgetsService.addIncomeSubCategory(vacationId, categoryId, name);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.put("/income_sub_category/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const { subCategoryId, name, categoryId } = req.body;
  try {
    const response = await budgetsService.updateIncomeSubCategory(vacationId, subCategoryId, name, categoryId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.delete("/income_sub_category/:id/:subCategoryId/:categoryId", async (req, res, next) => {
  const vacationId = req.params.id;
  const subCategoryId = req.params.subCategoryId;
  const categoryId = req.params.categoryId;
  try {
    const response = await budgetsService.deleteIncomeSubCategory(vacationId, subCategoryId, categoryId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

// === INCOME CRUD ===
router.get("/income/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  try {
    const response = await budgetsService.getIncome(vacationId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

router.post("/income/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const incomeDetails = req.body;
  try {
    await budgetsService.addIncome(vacationId, incomeDetails);
    res.send("response");
  } catch (error) {
    return next(error);
  }
});

router.put("/income/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const incomeDetails = req.body;
  try {
    await budgetsService.updateIncome(vacationId, incomeDetails);
    res.send("response");
  } catch (error) {
    return next(error);
  }
});

router.put("/income_status/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  const { actionId, paymentStatus } = req.body;
  try {
    await budgetsService.updateIncomeStatus(vacationId, actionId, paymentStatus);
    res.send("response");
  } catch (error) {
    return next(error);
  }
});

router.delete("/income/:id/:actionId", async (req, res, next) => {
  const vacationId = req.params.id;
  const actionId = req.params.actionId;
  try {
    await budgetsService.deleteIncome(vacationId, actionId);
    res.send("response");
  } catch (error) {
    return next(error);
  }
});

// === DELETE EXPENSE ===
router.delete("/expenses/:id/:actionId", async (req, res, next) => {
  const vacationId = req.params.id;
  const actionId = req.params.actionId;
  try {
    await budgetsService.deleteExpense(vacationId, actionId);
    res.send("response");
  } catch (error) {
    return next(error);
  }
});

// === SUMMARY ===
router.get("/summary/:id", async (req, res, next) => {
  const vacationId = req.params.id;
  try {
    const response = await budgetsService.getSummary(vacationId);
    res.send(response);
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
