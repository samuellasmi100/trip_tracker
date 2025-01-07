const budgetsDb = require("./budgetsDb")

const getCategory = async (vacationId) => {
  return await budgetsDb.getCategory(vacationId);
}
const getSubCategory = async (vacationId,categoryId) => {
  return await budgetsDb.getSubCategory(vacationId,categoryId);
}
const addFutureExpenses = async (vacationId,data) => {
    const { numberOfPayments, categories, subCategories } = data;
    const paymentCount = parseInt(numberOfPayments, 10);
    const payments = [];
  
    for (let i = 0; i < paymentCount; i++) {
      const paymentCurrency = data[`paymentCurrency${i}`];
      const expectedExpenditure = parseFloat(data[`expectedExpenditure${i}`]);
      let expectedExpenditureILS = expectedExpenditure; // Default to the original value for שקל
    
      if (paymentCurrency === 'דולר' || paymentCurrency === 'יורו') {
        const rate = await getExchangeRates(vacationId, paymentCurrency);
        expectedExpenditureILS = expectedExpenditure * rate;
      }
    
      const payment = {
        categoryId: categories,
        subCategoryId: subCategories,
        expectedExpenditure,
        expectedExpenditureILS: expectedExpenditureILS.toFixed(2), // Round to 2 decimals
        paymentDate: data[`paymentDate${i}`],
        paymentCurrency,
      };
    
      // Insert into the database
      await budgetsDb.addFutureExpenses(vacationId, payment);
      payments.push(payment);
    }
}

const getExchangeRates = async (vacationId,currency) => {
  return await budgetsDb.getExchangeRates(vacationId,currency)
};

module.exports = {
    getCategory,
    getSubCategory,
    getExchangeRates,
    addFutureExpenses
}