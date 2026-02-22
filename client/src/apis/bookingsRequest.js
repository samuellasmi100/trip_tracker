import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  getAllStatus(token, vacationId) {
    return Api.get(`/${END_POINT.BOOKINGS}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getByFamily(token, vacationId, familyId) {
    return Api.get(`/${END_POINT.BOOKINGS}/${vacationId}/${familyId}`, {
      headers: { Authorization: token },
    });
  },
  // Public — no auth required
  getPublicPage(vacationId, docToken) {
    return Api.get(`/public/booking/${vacationId}/${docToken}`);
  },
  submitBooking(vacationId, docToken, data) {
    return Api.post(`/public/booking/${vacationId}/${docToken}`, data);
  },
};
