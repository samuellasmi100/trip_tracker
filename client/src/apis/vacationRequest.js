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

  deleteVacationPart(token, id) {
    return Api.delete(`${END_POINT.VACATIONS}/part/${id}`, {
      headers: { Authorization: token },
    });
  },

  updateVacation(token, payload) {
    return Api.put(`${END_POINT.VACATIONS}`, payload, {
      headers: { Authorization: token },
    });
  },

}




