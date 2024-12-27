const budgetsDb = require("./budgetsDb")

const getCategory = async (vacationId) => {
  return await budgetsDb.getCategory(vacationId);
}
const getSubCategory = async (vacationId,categoryId) => {
  return await budgetsDb.getSubCategory(vacationId,categoryId);
}

module.exports = {
    getCategory,
    getSubCategory
}