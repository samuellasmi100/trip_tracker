import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

    getAll(token) {
        return Api.get(`/${END_POINT.BONDS}`,
        {
          headers: {
            Authorization: token,
          },
        });
    },
    update(token,bondData) {
        return Api.post(`/${END_POINT.BONDS}`,
        bondData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
    },
}