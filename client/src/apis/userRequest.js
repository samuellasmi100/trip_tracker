import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  login(body) {
    return Api.post(`/${END_POINT.LOGIN}`, body);
  },
  forgotPassword(body) {
    return Api.post(`/${END_POINT.FORGOT_PASSWORD}`, body);
  },
  pathAuthRequest(token) {
    return Api.get(`/${END_POINT.AUTH}/${END_POINT.PROTECTED_ROUTE}`, {
      headers: { Authorization: token },
    });
  },
  resetPassword(body , token){
    return Api.put(`/${END_POINT.AUTH}/${END_POINT.RESET_PASSWORD}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  authRequest(body, token) {
    return Api.post(`/${END_POINT.AUTH}/${END_POINT.AUTH_CHECK_TYPE}`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  qrCodePreAuthRequest(body, token) {
    return Api.post(
      `/${END_POINT.AUTH}/${END_POINT.AUTH_CHECK_QR_CODE}`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
  sixDigitAuthCheck(body, token) {
    return Api.post(
      `/${END_POINT.AUTH}/${END_POINT.AUTH_CHECK_SIX_DIGITS}`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
  getAllTraders(token) {
    return Api.get(`/${END_POINT.USER}/${END_POINT.TRADERS}`, {
      headers: { Authorization: token },
    });
  },
  createClientUser(token, clientUserData) {
    return Api.post(
      `/${END_POINT.USER}/${END_POINT.SIGN_UP_CLIENT_USER}`,
      clientUserData,
      {
        headers: { Authorization: token },
      }
    );
  },
  impersonationAuth(token, viewAsClientUserData) {
    return Api.put(
      `/${END_POINT.AUTH}/${END_POINT.IMPERSONATION_AUTH}`,
      viewAsClientUserData,
      {
        headers: { Authorization: token },
      }
    );
  },
  getOnlineUsers(token) {
    return Api.get(
      `/${END_POINT.USER}/${END_POINT.GET_USERS_ONLINE}`,
      {
        headers: { Authorization: token },
      }
    );
  },
};
