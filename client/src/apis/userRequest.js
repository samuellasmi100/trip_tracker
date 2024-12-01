import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  login(email,password) {
    console.log(email,password,"gggggggggggg")
    let loginData = {email,password}
    return Api.post(`${END_POINT.AUTH}/login`, loginData, {
    });
  },
  addUser(token,form) {
    return Api.post(`${END_POINT.USER}`, form, {
      headers: { Authorization: token },
    });
  },
  updateUser(token,form) {
    return Api.put(`${END_POINT.USER}`, form, {
      headers: { Authorization: token },
    });
  },
  addFamily(token,form) {
    return Api.post(`${END_POINT.FAMILY}`, form, {
      headers: { Authorization: token },
    });
  },
  getFamilyList(token) {
    return Api.get(`${END_POINT.FAMILY}`, {
      headers: { Authorization: token },
    });
  },
  getUser(token,familyId) {
    return Api.get(`${END_POINT.USER}/${familyId}`, {
      headers: { Authorization: token },
    });
  },
  getUserFamilyList(token,familyId) {
    return Api.get(`${END_POINT.USER}/${familyId}`, {
      headers: { Authorization: token },
    });
  },
  
}




