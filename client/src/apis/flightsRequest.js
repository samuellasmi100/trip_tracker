import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

    getUserFlightData(token,userId,familyId,isInGroup) {
        return Api.get(`/${END_POINT.FLIGHTS}/${userId}/${familyId}/${isInGroup}`, {
            headers: { Authorization: token },
          })
    },
    updateUserFligets(token,userId,form) {
        return Api.put(`${END_POINT.FLIGHTS}/${userId}`, form, {
          headers: { Authorization: token },
        });
      },
    addUserFlights(token,form) {
        return Api.post(`${END_POINT.FLIGHTS}`, form, {
          headers: { Authorization: token },
        });
      },
   
}
