import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

  getMainGuests(token,vacationId) {
    return Api.get(`/${END_POINT.STATIC}/main/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getGuests(token,vacationId) {
    return Api.get(`/${END_POINT.STATIC}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
};
