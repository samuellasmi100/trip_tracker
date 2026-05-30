import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  // Public — no auth header. The 4-digit verify issues a short-lived per-session
  // JWT (verifyToken) that the upload/delete calls must carry.
  getPublicPage(vacationId, docToken) {
    return Api.get(`/public/documents/${vacationId}/${docToken}`);
  },
  verifyPublic(vacationId, docToken, lastFourDigits) {
    return Api.post(`/public/documents/${vacationId}/${docToken}/verify`, { lastFourDigits });
  },
  // formData carries: file, verifyToken, user_id, doc_type_id
  uploadPublic(vacationId, docToken, formData) {
    return Api.post(`/public/documents/${vacationId}/${docToken}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deletePublic(vacationId, docToken, docId, verifyToken) {
    return Api.delete(`/public/documents/${vacationId}/${docToken}/${docId}`, {
      data: { verifyToken },
    });
  },
  // Fired once after a save batch commits → one detailed coordinator
  // notification. items = [{ userId, docTypeId, replaced }].
  notifyPublic(vacationId, docToken, verifyToken, items) {
    return Api.post(`/public/documents/${vacationId}/${docToken}/notify`, { verifyToken, items });
  },
  // Returns { url, fileName } — a presigned URL for a doc the verified family
  // uploaded, so the head can view it. verifyToken goes as a query param.
  viewPublic(vacationId, docToken, docId, verifyToken) {
    return Api.get(`/public/documents/${vacationId}/${docToken}/file/${docId}`, {
      params: { verifyToken },
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
  // Returns { url, fileName } for R2-backed docs (signed_registration etc.).
  // Pass { share: true } to bump the presigned-URL expiry from the default
  // 15 minutes to 7 days (the AWS S3 / R2 max), for the share-via-WhatsApp/
  // email flow where the recipient may not click immediately.
  // Pass { inline: true } to get an inline-disposition URL (renders in a new
  // tab instead of downloading) for the "view" action.
  getDownloadUrl(token, vacationId, docId, { share = false, inline = false } = {}) {
    const params = [];
    if (share) params.push("share=true");
    if (inline) params.push("inline=true");
    const qs = params.length ? `?${params.join("&")}` : "";
    return Api.get(`/${END_POINT.DOCUMENTS}/${vacationId}/${docId}/download-url${qs}`, {
      headers: { Authorization: token },
    });
  },
};
