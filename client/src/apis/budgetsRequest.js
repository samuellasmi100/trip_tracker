import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

  // === EXCHANGE RATES ===
  getExchangeRates(token, vacationId) {
    return Api.get(`/${END_POINT.BUDGET}/exchange_rates/${vacationId}`, {
      headers: { Authorization: token },
    });
  },

  updateExchangeRate(token, vacationId, data) {
    return Api.put(`/${END_POINT.BUDGET}/exchange_rates/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },

  // === EXISTING EXPENSE ENDPOINTS ===
  getCategories(token, vacationId) {
    return Api.get(`/${END_POINT.BUDGET}/category/${vacationId}`, {
      headers: { Authorization: token },
    });
  },

  getSubCategories(token, vacationId, categoryId) {
    return Api.get(`/${END_POINT.BUDGET}/sub_category/${vacationId}/${categoryId}`, {
      headers: { Authorization: token },
    });
  },

  addFutureExpenses(token, form, vacationId) {
    return Api.post(`/${END_POINT.BUDGET}/future_expenses/${vacationId}`, form, {
      headers: { Authorization: token },
    });
  },

  addExpenses(token, form, vacationId) {
    return Api.post(`/${END_POINT.BUDGET}/expenses/${vacationId}`, form, {
      headers: { Authorization: token },
    });
  },

  updateExpenses(token, form, vacationId) {
    return Api.put(`/${END_POINT.BUDGET}/expenses/${vacationId}`, form, {
      headers: { Authorization: token },
    });
  },

  updateFutureExpenses(token, form, vacationId) {
    return Api.put(`/${END_POINT.BUDGET}/future_expenses/${vacationId}`, form, {
      headers: { Authorization: token },
    });
  },

  updateExpensesStatus(token, id, paymentStatus, vacationId) {
    let data = { paymentStatus, id };
    return Api.put(`/${END_POINT.BUDGET}/status_expenses/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },

  getExpenses(token, vacationId) {
    return Api.get(`/${END_POINT.BUDGET}/expenses/${vacationId}`, {
      headers: { Authorization: token },
    });
  },

  getFutureExpenses(token, vacationId) {
    return Api.get(`/${END_POINT.BUDGET}/future_expenses/${vacationId}`, {
      headers: { Authorization: token },
    });
  },

  // === EXPENSE CATEGORY CRUD ===
  addCategory(token, vacationId, data) {
    return Api.post(`/${END_POINT.BUDGET}/category/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },

  updateCategory(token, vacationId, data) {
    return Api.put(`/${END_POINT.BUDGET}/category/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },

  deleteCategory(token, vacationId, categoryId) {
    return Api.delete(`/${END_POINT.BUDGET}/category/${vacationId}/${categoryId}`, {
      headers: { Authorization: token },
    });
  },

  // === EXPENSE SUBCATEGORY CRUD ===
  addSubCategory(token, vacationId, data) {
    return Api.post(`/${END_POINT.BUDGET}/sub_category/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },

  updateSubCategory(token, vacationId, data) {
    return Api.put(`/${END_POINT.BUDGET}/sub_category/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },

  deleteSubCategory(token, vacationId, subCategoryId, categoryId) {
    return Api.delete(`/${END_POINT.BUDGET}/sub_category/${vacationId}/${subCategoryId}/${categoryId}`, {
      headers: { Authorization: token },
    });
  },

  // === INCOME CATEGORY CRUD ===
  getIncomeCategories(token, vacationId) {
    return Api.get(`/${END_POINT.BUDGET}/income_category/${vacationId}`, {
      headers: { Authorization: token },
    });
  },

  addIncomeCategory(token, vacationId, data) {
    return Api.post(`/${END_POINT.BUDGET}/income_category/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },

  updateIncomeCategory(token, vacationId, data) {
    return Api.put(`/${END_POINT.BUDGET}/income_category/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },

  deleteIncomeCategory(token, vacationId, categoryId) {
    return Api.delete(`/${END_POINT.BUDGET}/income_category/${vacationId}/${categoryId}`, {
      headers: { Authorization: token },
    });
  },

  // === INCOME SUBCATEGORY CRUD ===
  getIncomeSubCategories(token, vacationId, categoryId) {
    return Api.get(`/${END_POINT.BUDGET}/income_sub_category/${vacationId}/${categoryId}`, {
      headers: { Authorization: token },
    });
  },

  addIncomeSubCategory(token, vacationId, data) {
    return Api.post(`/${END_POINT.BUDGET}/income_sub_category/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },

  updateIncomeSubCategory(token, vacationId, data) {
    return Api.put(`/${END_POINT.BUDGET}/income_sub_category/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },

  deleteIncomeSubCategory(token, vacationId, subCategoryId, categoryId) {
    return Api.delete(`/${END_POINT.BUDGET}/income_sub_category/${vacationId}/${subCategoryId}/${categoryId}`, {
      headers: { Authorization: token },
    });
  },

  // === INCOME CRUD ===
  getIncome(token, vacationId) {
    return Api.get(`/${END_POINT.BUDGET}/income/${vacationId}`, {
      headers: { Authorization: token },
    });
  },

  addIncome(token, form, vacationId) {
    return Api.post(`/${END_POINT.BUDGET}/income/${vacationId}`, form, {
      headers: { Authorization: token },
    });
  },

  updateIncome(token, form, vacationId) {
    return Api.put(`/${END_POINT.BUDGET}/income/${vacationId}`, form, {
      headers: { Authorization: token },
    });
  },

  updateIncomeStatus(token, actionId, paymentStatus, vacationId) {
    return Api.put(`/${END_POINT.BUDGET}/income_status/${vacationId}`, { actionId, paymentStatus }, {
      headers: { Authorization: token },
    });
  },

  deleteIncome(token, vacationId, actionId) {
    return Api.delete(`/${END_POINT.BUDGET}/income/${vacationId}/${actionId}`, {
      headers: { Authorization: token },
    });
  },

  // === DELETE EXPENSE ===
  deleteExpense(token, vacationId, actionId) {
    return Api.delete(`/${END_POINT.BUDGET}/expenses/${vacationId}/${actionId}`, {
      headers: { Authorization: token },
    });
  },

  // === SUMMARY ===
  getSummary(token, vacationId) {
    return Api.get(`/${END_POINT.BUDGET}/summary/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
};
