const budgetsDb = require("./budgetsDb")

const getCategory = async (vacationId) => {
  return await budgetsDb.getCategory(vacationId);
}

const getSubCategory = async (vacationId,categoryId) => {
  return await budgetsDb.getSubCategory(vacationId,categoryId);
}

const addExpenses = async (vacationId,data,isFuture) => {
    const { numberOfPayments, categories, subCategories } = data;
    const paymentCount = parseInt(numberOfPayments, 10);
    for (let i = 0; i < paymentCount; i++) {
      const paymentCurrency = data[`paymentCurrency${i}`];
      const expenditure = parseFloat(data[`expenditure${i}`]);
      let expenditureILS = expenditure; //
    
      if (paymentCurrency === 'דולר' || paymentCurrency === 'יורו') {
        const rate = await getExchangeRates(vacationId, paymentCurrency);
        expenditureILS = expenditure * rate;
      }
    
      const payment = {
        categoryId: categories,
        subCategoryId: subCategories,
        expenditure,
        expenditureILS: expenditureILS.toFixed(2), // Round to 2 decimals
        paymentDate: data[`paymentDate${i}`],
        paymentCurrency,
      };
      if(isFuture){
        await budgetsDb.addFutureExpenses(vacationId, payment);
      }else {
        await budgetsDb.addExpenses(vacationId, payment);
      }
    }
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


module.exports = {
    getCategory,
    getSubCategory,
    getExchangeRates,
    getFutureExpenses,
    getExpenses,
    addExpenses
}