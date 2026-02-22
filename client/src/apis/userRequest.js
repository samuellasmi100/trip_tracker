import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  login(email,password) {
    let loginData = {email,password}
    return Api.post(`${END_POINT.AUTH}/login`, loginData, {
    });
  },
  addUser(token,form,newFamilyId,newUserId,vacationId) {
    return Api.post(`${END_POINT.USER}/${vacationId}`, {form,newFamilyId,newUserId}, {
      headers: { Authorization: token },
    });
  },
  updateUser(token,form,vacationId) {
    return Api.put(`${END_POINT.USER}/${vacationId}`, form, {
      headers: { Authorization: token },
    });
  },
  addFamily(token,form,newFamilyId,vacationId) {
    return Api.post(`${END_POINT.FAMILY}/${vacationId}`, {form,newFamilyId}, {
      headers: { Authorization: token },
    });
  },
  getFamilyList(token,vacationId) {
    return Api.get(`${END_POINT.FAMILY}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getUser(token,familyId,vacationId) {
    return Api.get(`${END_POINT.USER}/${familyId}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getUserFamilyList(token,familyId,vacationId) {
    return Api.get(`${END_POINT.USER}/${familyId}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getUserDetails(token,userId,familyId,isIngroup,vacationId) {
    return Api.get(`${END_POINT.USER}/details/${userId}/${familyId}/${isIngroup}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  deleteGuests(token,userId,vacationId) {
    return Api.delete(`${END_POINT.USER}/${userId}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  updateFamily(token, data, vacationId) {
    return Api.put(`${END_POINT.FAMILY}/${vacationId}`, data, {
      headers: { Authorization: token },
    });
  },
  deleteMainGuests(token,userId,vacationId) {
    return Api.delete(`${END_POINT.USER}/main/${userId}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  
}




