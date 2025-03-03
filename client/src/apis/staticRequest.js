import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

  getMainGuests(token,vacationId) {
    return Api.get(`/${END_POINT.STATIC}/user/main/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getGuests(token,vacationId) {
    return Api.get(`/${END_POINT.STATIC}/user/${vacationId}`, {
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
