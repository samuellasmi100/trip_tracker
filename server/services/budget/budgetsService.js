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
module.exports = {
    getCategory,
    getSubCategory,
    getExchangeRates,
    getFutureExpenses,
    getExpenses,
    addExpenses,
    updateExpensesAndFutureExpenses,
    addFutureExpenses,
    updateExpensesStatus,
    updateExpenses
}