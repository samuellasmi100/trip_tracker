import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  // Send the browser-parsed Excel rows; the server applies the mapping rules
  // and returns a structured import report.
  importFamilies(token, vacationId, rows) {
    return Api.post(`${END_POINT.FAMILY_IMPORT}/${vacationId}`, { rows }, {
      headers: { Authorization: token },
    });
  },
};
