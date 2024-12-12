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
};
