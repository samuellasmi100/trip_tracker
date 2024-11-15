import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  login(body) {
    return Api.post(`/${END_POINT.LOGIN}`, body);
  },


  createUser(userData) {
    return Api.post(
      `/${END_POINT.USER}`,
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
}}
  


