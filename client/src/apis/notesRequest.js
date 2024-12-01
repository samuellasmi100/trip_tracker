import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

  addNotes(token, form) {
    return Api.post(
      `/${END_POINT.NOTES}`,form,{
        headers: {
          Authorization: token,
        },
      }
    );
  },
};
