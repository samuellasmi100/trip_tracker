const budgetsDb = require("./budgetsDb")
const uuid = require("uuid").v4;
const moment = require("moment");

const getCategory = async (vacationId) => {
  return await budgetsDb.getCategory(vacationId);
}

const getSubCategory = async (vacationId,categoryId) => {
  return await budgetsDb.getSubCategory(vacationId,categoryId);
}

const addFutureExpenses = async (vacationId,data,isFuture) => {
    const { numberOfPayments, categories, subCategories } = data;
    const paymentCount = parseInt(numberOfPayments, 10);
    for (let i = 0; i < paymentCount; i++) {
      const actionId = uuid();
      const paymentCurrency = data[`paymentCurrency${i}`];
      const expenditure = parseFloat(data[`expenditure${i}`]);
      let expenditureILS = expenditure; 
    
      if (paymentCurrency === 'דולר' || paymentCurrency === 'יורו') {
        const rate = await getExchangeRates(vacationId, paymentCurrency);
        expenditureILS = expenditure * rate;
      }
    
      const payment = {
        categoryId: categories,
        subCategoryId: subCategories,
        expenditure,
        expenditureILS: expenditureILS.toFixed(2),
        paymentDate: data[`paymentDate${i}`],
        paymentCurrency,
        actionId,
        isPaid:false,
        actualPaymentDateDate:"",
        isUnexpected:false
      };
        await budgetsDb.addFutureExpenses(vacationId, payment);
        await budgetsDb.addExpenses(vacationId, payment);
    }
}

const addExpenses = async (vacationId,data,isFuture) => {
  const actualPaymentDateDate = moment().format('YYYY-MM-DD');
  const { numberOfPayments, categories, subCategories } = data;
  const paymentCount = parseInt(numberOfPayments, 10);
  for (let i = 0; i < paymentCount; i++) {
    const actionId = uuid();
    const paymentCurrency = data[`paymentCurrency${i}`];
    const expenditure = parseFloat(data[`expenditure${i}`]);
    let expenditureILS = expenditure; 
  
    if (paymentCurrency === 'דולר' || paymentCurrency === 'יורו') {
      const rate = await getExchangeRates(vacationId, paymentCurrency);
      expenditureILS = expenditure * rate;
    }
  
    const payment = {
      categoryId: categories,
      subCategoryId: subCategories,
      expenditure,
      expenditureILS: expenditureILS.toFixed(2),
      paymentDate: data[`paymentDate${i}`],
      paymentCurrency,
      actionId,
      isPaid:true,
      actualPaymentDateDate,
      isUnexpected:true
    };
      await budgetsDb.addExpenses(vacationId, payment);
  }
}

const updateExpensesAndFutureExpenses = async(vacationId,data) => {
  let expenditureILS = data.expenditure0;
  if (data.paymentCurrency0 === 'דולר' || data.paymentCurrency0 === 'יורו') {
    const rate = await getExchangeRates(vacationId,data.paymentCurrency0);
    expenditureILS = data.expenditure0 * rate;
  }

  data.expenditureILS = expenditureILS
  await budgetsDb.updateExpenses(vacationId,data)
  await budgetsDb.updateFutureExpenses(vacationId,data)


}

const getExchangeRates = async (vacationId,currency) => {
  return await budgetsDb.getExchangeRates(vacationId,currency)
};

const getAllExchangeRates = async (vacationId) => {
  return await budgetsDb.getAllExchangeRates(vacationId);
};

const upsertExchangeRate = async (vacationId, ccy, amount) => {
  await budgetsDb.upsertExchangeRate(vacationId, ccy, amount);
  return await budgetsDb.getAllExchangeRates(vacationId);
};

const getFutureExpenses = async (vacationId) => {
  return await budgetsDb.getFutureExpenses(vacationId);
}

const getExpenses = async (vacationId) => {
  return await budgetsDb.getExpenses(vacationId);
}

const updateExpensesStatus = async (vacationId,expensesId,paymentStatus) => {
  return await budgetsDb.updateExpensesStatus(vacationId,expensesId,paymentStatus);
}

const updateExpenses = async (vacationId,data) => {
  let expenditureILS = data.expenditure0;
  if (data.paymentCurrency0 === 'דולר' || data.paymentCurrency0 === 'יורו') {
    const rate = await getExchangeRates(vacationId,data.paymentCurrency0);
    expenditureILS = data.expenditure0 * rate;
  }

  data.expenditureILS = expenditureILS
  await budgetsDb.updateExpenses(vacationId,data)
}
// --- EXPENSE CATEGORY CRUD ---
const addCategory = async (vacationId, name) => {
  await budgetsDb.addCategory(vacationId, name);
  return await budgetsDb.getCategory(vacationId);
}

const updateCategory = async (vacationId, id, name) => {
  await budgetsDb.updateCategory(vacationId, id, name);
  return await budgetsDb.getCategory(vacationId);
}

const deleteCategory = async (vacationId, id) => {
  await budgetsDb.deleteCategory(vacationId, id);
  return await budgetsDb.getCategory(vacationId);
}

// --- EXPENSE SUBCATEGORY CRUD ---
const addSubCategory = async (vacationId, categoryId, name) => {
  await budgetsDb.addSubCategory(vacationId, categoryId, name);
  return await budgetsDb.getSubCategory(vacationId, categoryId);
}

const updateSubCategory = async (vacationId, id, name, categoryId) => {
  await budgetsDb.updateSubCategory(vacationId, id, name);
  return await budgetsDb.getSubCategory(vacationId, categoryId);
}

const deleteSubCategory = async (vacationId, id, categoryId) => {
  await budgetsDb.deleteSubCategory(vacationId, id);
  return await budgetsDb.getSubCategory(vacationId, categoryId);
}

// --- INCOME CATEGORY CRUD ---
const getIncomeCategory = async (vacationId) => {
  return await budgetsDb.getIncomeCategory(vacationId);
}

const addIncomeCategory = async (vacationId, name) => {
  await budgetsDb.addIncomeCategory(vacationId, name);
  return await budgetsDb.getIncomeCategory(vacationId);
}

const updateIncomeCategory = async (vacationId, id, name) => {
  await budgetsDb.updateIncomeCategory(vacationId, id, name);
  return await budgetsDb.getIncomeCategory(vacationId);
}

const deleteIncomeCategory = async (vacationId, id) => {
  await budgetsDb.deleteIncomeCategory(vacationId, id);
  return await budgetsDb.getIncomeCategory(vacationId);
}

// --- INCOME SUBCATEGORY CRUD ---
const getIncomeSubCategory = async (vacationId, categoryId) => {
  return await budgetsDb.getIncomeSubCategory(vacationId, categoryId);
}

const addIncomeSubCategory = async (vacationId, categoryId, name) => {
  await budgetsDb.addIncomeSubCategory(vacationId, categoryId, name);
  return await budgetsDb.getIncomeSubCategory(vacationId, categoryId);
}

const updateIncomeSubCategory = async (vacationId, id, name, categoryId) => {
  await budgetsDb.updateIncomeSubCategory(vacationId, id, name);
  return await budgetsDb.getIncomeSubCategory(vacationId, categoryId);
}

const deleteIncomeSubCategory = async (vacationId, id, categoryId) => {
  await budgetsDb.deleteIncomeSubCategory(vacationId, id);
  return await budgetsDb.getIncomeSubCategory(vacationId, categoryId);
}

// --- INCOME CRUD ---
const addIncome = async (vacationId, data) => {
  const { numberOfPayments, categories, subCategories } = data;
  const paymentCount = parseInt(numberOfPayments, 10);
  for (let i = 0; i < paymentCount; i++) {
    const actionId = uuid();
    const paymentCurrency = data[`paymentCurrency${i}`];
    const expenditure = parseFloat(data[`expenditure${i}`]);
    let expenditureILS = expenditure;

    if (paymentCurrency === 'דולר' || paymentCurrency === 'יורו') {
      const rate = await getExchangeRates(vacationId, paymentCurrency);
      expenditureILS = expenditure * rate;
    }

    const isPaid = data.isPaid || false;
    const actualPaymentDate = isPaid ? moment().format('YYYY-MM-DD') : "";

    const payment = {
      categoryId: categories,
      subCategoryId: subCategories,
      expenditure,
      expenditureILS: expenditureILS.toFixed(2),
      paymentDate: data[`paymentDate${i}`],
      actualPaymentDate,
      paymentCurrency,
      actionId,
      isPaid,
      description: data.description || ""
    };
    await budgetsDb.addIncome(vacationId, payment);
  }
}

const getIncome = async (vacationId) => {
  return await budgetsDb.getIncome(vacationId);
}

const updateIncome = async (vacationId, data) => {
  let expenditureILS = data.expenditure0;
  if (data.paymentCurrency0 === 'דולר' || data.paymentCurrency0 === 'יורו') {
    const rate = await getExchangeRates(vacationId, data.paymentCurrency0);
    expenditureILS = data.expenditure0 * rate;
  }
  data.expenditureILS = expenditureILS;
  await budgetsDb.updateIncome(vacationId, data);
}

const updateIncomeStatus = async (vacationId, actionId, paymentStatus) => {
  return await budgetsDb.updateIncomeStatus(vacationId, actionId, paymentStatus);
}

const deleteIncome = async (vacationId, actionId) => {
  await budgetsDb.deleteIncome(vacationId, actionId);
}

// --- DELETE EXPENSE ---
const deleteExpense = async (vacationId, actionId) => {
  await budgetsDb.deleteExpense(vacationId, actionId);
  await budgetsDb.deleteFutureExpense(vacationId, actionId);
}

// --- SUMMARY ---
const getSummary = async (vacationId) => {
  const [summary, expensesByCategory, incomeByCategory] = await Promise.all([
    budgetsDb.getSummary(vacationId),
    budgetsDb.getExpensesByCategory(vacationId),
    budgetsDb.getIncomeByCategory(vacationId)
  ]);
  return { summary, expensesByCategory, incomeByCategory };
}

module.exports = {
    getCategory,
    getSubCategory,
    getExchangeRates,
    getAllExchangeRates,
    upsertExchangeRate,
    getFutureExpenses,
    getExpenses,
    addExpenses,
    updateExpensesAndFutureExpenses,
    addFutureExpenses,
    updateExpensesStatus,
    updateExpenses,
    addCategory,
    updateCategory,
    deleteCategory,
    addSubCategory,
    updateSubCategory,
    deleteSubCategory,
    getIncomeCategory,
    addIncomeCategory,
    updateIncomeCategory,
    deleteIncomeCategory,
    getIncomeSubCategory,
    addIncomeSubCategory,
    updateIncomeSubCategory,
    deleteIncomeSubCategory,
    addIncome,
    getIncome,
    updateIncome,
    updateIncomeStatus,
    deleteIncome,
    deleteExpense,
    getSummary,
}