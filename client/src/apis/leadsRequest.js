import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  getAll(token, vacationId) {
    return Api.get(`/${END_POINT.LEADS}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getById(token, vacationId, leadId) {
    return Api.get(`/${END_POINT.LEADS}/${vacationId}/${leadId}`, {
      headers: { Authorization: token },
    });
  },
  getSummary(token, vacationId) {
    return Api.get(`/${END_POINT.LEADS}/summary/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  create(token, vacationId, data) {
    return Api.post(`/${END_POINT.LEADS}/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },
  update(token, vacationId, leadId, data) {
    return Api.put(`/${END_POINT.LEADS}/${vacationId}/${leadId}`, data, {
      headers: { Authorization: token },
    });
  },
  addNote(token, vacationId, leadId, noteText) {
    return Api.post(
      `/${END_POINT.LEADS}/${vacationId}/${leadId}/notes`,
      { note_text: noteText },
      { headers: { Authorization: token } }
    );
  },
  deleteLead(token, vacationId, leadId) {
    return Api.delete(`/${END_POINT.LEADS}/${vacationId}/${leadId}`, {
      headers: { Authorization: token },
    });
  },
  // Public — no auth header
  submitPublic(vacationId, data) {
    return Api.post(`/public/leads/${vacationId}`, data);
  },
};
