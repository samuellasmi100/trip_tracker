import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  
  addVacation(token,form) {
    return Api.post(`${END_POINT.VACATIONS}`, form, {
      headers: { Authorization: token },
    });
  },
 
  getVacations(token) {
    return Api.get(`${END_POINT.VACATIONS}`, {
      headers: { Authorization: token },
    });
  },
  
}




