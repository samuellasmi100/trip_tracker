import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  // Public — no auth header
  getPublicPage(vacationId, docToken) {
    return Api.get(`/public/documents/${vacationId}/${docToken}`);
  },
  uploadPublic(vacationId, docToken, formData) {
    return Api.post(`/public/documents/${vacationId}/${docToken}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // Coordinator — requires auth token
  getAllFamiliesStatus(token, vacationId) {
    return Api.get(`/${END_POINT.DOCUMENTS}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getFamilyDocuments(token, vacationId, familyId) {
    return Api.get(`/${END_POINT.DOCUMENTS}/${vacationId}/family/${familyId}`, {
      headers: { Authorization: token },
    });
  },
  deleteDocument(token, vacationId, docId) {
    return Api.delete(`/${END_POINT.DOCUMENTS}/${vacationId}/${docId}`, {
      headers: { Authorization: token },
    });
  },
  getDocumentTypes(token, vacationId) {
    return Api.get(`/${END_POINT.DOCUMENTS}/types/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  addDocumentType(token, vacationId, data) {
    return Api.post(`/${END_POINT.DOCUMENTS}/types/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },
  deleteDocumentType(token, vacationId, typeId) {
    return Api.delete(`/${END_POINT.DOCUMENTS}/types/${vacationId}/${typeId}`, {
      headers: { Authorization: token },
    });
  },
  getFamilyLink(token, vacationId, familyId) {
    return Api.get(`/${END_POINT.DOCUMENTS}/link/${vacationId}/${familyId}`, {
      headers: { Authorization: token },
    });
  },
};
