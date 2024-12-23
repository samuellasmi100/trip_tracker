const budgetsDb = require("./budgetsDb")

const getCategory = async (vacationId) => {
  await budgetsDb.getCategory(vacationId);
}
const getSubCategory = async (vacationId,categoryId) => {
  await budgetsDb.getSubCategory(vacationId,categoryId);
}

module.exports = {
    getCategory,
    getSubCategory
}