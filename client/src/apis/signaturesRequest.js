import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  getAllStatus(token, vacationId) {
    return Api.get(`/${END_POINT.SIGNATURES}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getByFamily(token, vacationId, familyId) {
    return Api.get(`/${END_POINT.SIGNATURES}/${vacationId}/${familyId}`, {
      headers: { Authorization: token },
    });
  },
  markSent(token, vacationId, familyId) {
    return Api.post(`/${END_POINT.SIGNATURES}/send/${vacationId}/${familyId}`, {}, {
      headers: { Authorization: token },
    });
  },
  deleteSignature(token, vacationId, familyId) {
    return Api.delete(`/${END_POINT.SIGNATURES}/${vacationId}/${familyId}`, {
      headers: { Authorization: token },
    });
  },
  // Public — no auth required
  getPublicPage(vacationId, docToken) {
    return Api.get(`/public/sign/${vacationId}/${docToken}`);
  },
  submitSignature(vacationId, docToken, data) {
    return Api.post(`/public/sign/${vacationId}/${docToken}`, data);
  },
};
