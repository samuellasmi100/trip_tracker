import Api from "./baseApi";

// Authenticated + public endpoints for the head-of-family registration flow.
// Public calls (no Bearer token) drive the PublicRegistration page; the
// authenticated `create` call backs the "send link" button on the family list.
export default {
  // Authenticated — employee initiates the link from the family list.
  create(token, vacationId, familyId) {
    return Api.post(
      `/registrations/${vacationId}`,
      { familyId },
      { headers: { Authorization: token } }
    );
  },

  // Public — no auth required.
  getPublicPage(vacationId, regToken) {
    return Api.get(`/public/register/${vacationId}/${regToken}`);
  },
  verifyPhone(vacationId, regToken, lastFourDigits) {
    return Api.post(`/public/register/${vacationId}/${regToken}/verify`, { lastFourDigits });
  },
  submit(vacationId, regToken, payload) {
    // payload = { verifyToken, signatureData, clientInputs }
    return Api.post(`/public/register/${vacationId}/${regToken}/submit`, payload);
  },
};
