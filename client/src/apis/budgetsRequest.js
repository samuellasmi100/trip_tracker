import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

  getCategories(token,vacationId) {
    return Api.get(`/${END_POINT.BUDGET}/category/${vacationId}`, {
      headers: { Authorization: token },
    });
  },

  getSubCategories(token,vacationId,categoryId) {
    return Api.get(`/${END_POINT.BUDGET}/sub_category/${vacationId}/${categoryId}`, {
      headers: { Authorization: token },
    });
  },
 
  addFutureExpenses(token, form,vacationId) {
    return Api.post(
      `/${END_POINT.BUDGET}/future_expenses/${vacationId}`,form,{
        headers: {
          Authorization: token,
        },
      }
    );
  },
  addExpenses(token, form,vacationId) {
    return Api.post(
      `/${END_POINT.BUDGET}/expenses/${vacationId}`,form,{
        headers: {
          Authorization: token,
        },
      }
    );
  },
  updateExpenses(token, form,vacationId) {
    return Api.put(
      `/${END_POINT.BUDGET}/expenses/${vacationId}`,form,{
        headers: {
          Authorization: token,
        },
      }
    );
  },
  getExpenses(token,vacationId) {
    return Api.get(`/${END_POINT.BUDGET}/expenses/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getFutureExpenses(token,vacationId) {
    return Api.get(`/${END_POINT.BUDGET}/future_expenses/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
};
