import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  sendLog(token, auctionData) {
    return Api.post(`${END_POINT.USER_LOGS}`, auctionData, {
      headers: { Authorization: token },
    });
  },
  getWorkSpaceLogs(token, searchTerm) {
    return Api.get(`/${END_POINT.USER_LOGS}`, {
      params: { searchTerm: searchTerm },
      headers: { Authorization: token },
    });
  },
  getLogs(token, searchTerm) {
    return Api.get(`/${END_POINT.USER_LOGS}/${END_POINT.REPORTS}`, {
      params: { searchTerm: searchTerm },
      headers: { Authorization: token },
    });
  },
  getActivityWorkSpaceLog(
    token,
    requestOrigin,
    date,
    searchTerm,
    impersonationClientUserId
  ) {
    return Api.get(`/${END_POINT.USER_LOGS}/${impersonationClientUserId}`, {
      params: {
        date: date,
        searchTerm: searchTerm,
        requestOrigin: requestOrigin,
      },
      headers: { Authorization: token },
    });
  },
  getActivityLog(
    token,
    requestOrigin,
    date,
    searchTerm,
    impersonationClientUserId
  ) {
    return Api.get(`/${END_POINT.USER_LOGS}/${END_POINT.REPORTS}/${impersonationClientUserId}`, {
      params: {
        date: date,
        searchTerm: searchTerm,
        requestOrigin: requestOrigin,
      },
      headers: { Authorization: token },
    });
  },
};
