import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  getAgreement(token, vacationId) {
    return Api.get(`/${END_POINT.SETTINGS}/${vacationId}/agreement`, {
      headers: { Authorization: token },
    });
  },
  updateAgreement(token, vacationId, text) {
    return Api.put(
      `/${END_POINT.SETTINGS}/${vacationId}/agreement`,
      { agreement_text: text },
      { headers: { Authorization: token } }
    );
  },
  getFlightCompanies(token) {
    return Api.get(`/${END_POINT.SETTINGS}/flight-companies`, {
      headers: { Authorization: token },
    });
  },
  addFlightCompany(token, data) {
    return Api.post(`/${END_POINT.SETTINGS}/flight-companies`, data, {
      headers: { Authorization: token },
    });
  },
  deleteFlightCompany(token, id) {
    return Api.delete(`/${END_POINT.SETTINGS}/flight-companies/${id}`, {
      headers: { Authorization: token },
    });
  },
};
