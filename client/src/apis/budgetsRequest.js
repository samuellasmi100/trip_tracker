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
  getFlightsDetails(token,vacationId) {
    return Api.get(`/${END_POINT.STATIC}/flights/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getVacationDetails(token,vacationId) {
    return Api.get(`/${END_POINT.STATIC}/vacation/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getPaymentsDetails(token,vacationId) {
    return Api.get(`/${END_POINT.STATIC}/payments/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
};
