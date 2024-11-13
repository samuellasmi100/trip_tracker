import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  getReports(token, date , searchTerm,impersonationClientUserId) {
    return Api.get(`/${END_POINT.REPORTS}/${impersonationClientUserId}`, {
      params: {date : date , searchTerm : searchTerm},
      headers: { Authorization: token },
    });
  },
};
