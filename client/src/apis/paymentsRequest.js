import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

  getPayments(token, familyId,vacationId) {
    return Api.get(`/${END_POINT.PAYMENTS}/${familyId}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  addPayments(token,form,vacationId) {
    return Api.post(`${END_POINT.PAYMENTS}/${vacationId}`, form, {
      headers: { Authorization: token },
    });
  },
  getUserPayments(token,userId,vacationId) {
    return Api.get(`/${END_POINT.PAYMENTS}/user/${userId}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
};
