import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

  getPayments(token, familyId) {
    return Api.get(`/${END_POINT.PAYMENTS}/${familyId}`, {
      headers: { Authorization: token },
    });
  },
  addPayments(token,form) {
    return Api.post(`${END_POINT.PAYMENTS}`, form, {
      headers: { Authorization: token },
    });
  },
 
};
