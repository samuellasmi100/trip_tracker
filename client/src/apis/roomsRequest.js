import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  getAll(token,) {
    return Api.get(`/${END_POINT.ROOMS}}`, {
      headers: { Authorization: token },
    });
  },
  getAllWithCount(token,) {
    return Api.get(`/${END_POINT.ROOMS}/count`, {
      headers: { Authorization: token },
    });
  },
};
