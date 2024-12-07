import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  
  addVacation(token,form) {
    return Api.post(`${END_POINT.VACATIONS}`, form, {
      headers: { Authorization: token },
    });
  },
 
  getVacations(token,vacationId) {
    return Api.get(`${END_POINT.VACATIONS}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  
}




