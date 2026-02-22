import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  // All payments for a single family (used by dialog)
  getPayments(token, vacationId, familyId) {
    return Api.get(`/${END_POINT.PAYMENTS}/${vacationId}/family/${familyId}`, {
      headers: { Authorization: token },
    });
  },

  // Per-family summary totals (used by widget)
  getSummary(token, vacationId) {
    return Api.get(`/${END_POINT.PAYMENTS}/${vacationId}/summary`, {
      headers: { Authorization: token },
    });
  },

  // Add one payment record
  addPayment(token, vacationId, paymentData) {
    return Api.post(`/${END_POINT.PAYMENTS}/${vacationId}`, paymentData, {
      headers: { Authorization: token },
    });
  },

  // Update a payment record
  updatePayment(token, vacationId, paymentId, paymentData) {
    return Api.put(`/${END_POINT.PAYMENTS}/${vacationId}/${paymentId}`, paymentData, {
      headers: { Authorization: token },
    });
  },

  // Delete a payment record
  deletePayment(token, vacationId, paymentId) {
    return Api.delete(`/${END_POINT.PAYMENTS}/${vacationId}/${paymentId}`, {
      headers: { Authorization: token },
    });
  },

  // ── Provider config ────────────────────────────────────────────────────────

  getProviderConfig(token) {
    return Api.get(`/${END_POINT.PAYMENTS}/provider`, {
      headers: { Authorization: token },
    });
  },

  saveProviderConfig(token, config) {
    return Api.post(`/${END_POINT.PAYMENTS}/provider`, config, {
      headers: { Authorization: token },
    });
  },

  // ── Gateway sessions ───────────────────────────────────────────────────────

  initPaymentSession(token, vacationId, data) {
    return Api.post(`/${END_POINT.PAYMENTS}/${vacationId}/init-session`, data, {
      headers: { Authorization: token },
    });
  },

  createPaymentLink(token, vacationId, data) {
    return Api.post(`/${END_POINT.PAYMENTS}/${vacationId}/create-link`, data, {
      headers: { Authorization: token },
    });
  },

  verifyPayment(token, vacationId, paymentId) {
    return Api.post(`/${END_POINT.PAYMENTS}/${vacationId}/verify/${paymentId}`, {}, {
      headers: { Authorization: token },
    });
  },
};
