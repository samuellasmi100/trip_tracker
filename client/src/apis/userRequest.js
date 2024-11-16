import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  login(body) {
    return Api.post(`/${END_POINT.LOGIN}`, body);
  },


  createParantUser(userData) {
    return Api.post(
      `/${END_POINT.USER}`,
      userData,
      // {
      //   headers: { Authorization: token },
      // }
    );
  },
  createChildUser(userData) {
    return Api.post(
      `/${END_POINT.USER}/child`,
      userData,
      // {
      //   headers: { Authorization: token },
      // }
    );
  },
  getMainUsers() {
    return Api.get(`/${END_POINT.USER}/all`, {
        // headers: { Authorization: token },
      })
},
getChildUser(id) {
  return Api.get(`/${END_POINT.USER}/child/${id}`, {
      // headers: { Authorization: token },
    })
}}

  


