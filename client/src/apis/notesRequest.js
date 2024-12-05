import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

  addNotes(token, form,vacationId) {
    return Api.post(
      `/${END_POINT.NOTES}/${vacationId}`,form,{
        headers: {
          Authorization: token,
        },
      }
    );
  },
};
