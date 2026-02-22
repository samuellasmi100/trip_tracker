import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

  getMainGuests(token, vacationId, search = '', limit = 50, offset = 0) {
    return Api.get(`/${END_POINT.STATIC}/user/main/${vacationId}`, {
      headers: { Authorization: token },
      params: { search, limit, offset },
    });
  },
  getGuests(token, vacationId, search = '', limit = 50, offset = 0) {
    return Api.get(`/${END_POINT.STATIC}/user/${vacationId}`, {
      headers: { Authorization: token },
      params: { search, limit, offset },
    });
  },
  getFlightsDetails(token, vacationId) {
    return Api.get(`/${END_POINT.STATIC}/flights/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getVacationDetails(token, vacationId, search = '', limit = 50, offset = 0) {
    return Api.get(`/${END_POINT.STATIC}/vacation/${vacationId}`, {
      headers: { Authorization: token },
      params: { search, limit, offset },
    });
  },
  getPaymentsDetails(token, vacationId) {
    return Api.get(`/${END_POINT.STATIC}/payments/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
};
