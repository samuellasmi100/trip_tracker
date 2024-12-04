import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {

    getUserFlightData(token,userId,familyId,isInGroup,vacationId) {
        return Api.get(`/${END_POINT.FLIGHTS}/${userId}/${familyId}/${isInGroup}/${vacationId}`, {
            headers: { Authorization: token },
          })
    },
    updateUserFligets(token,userId,form,vacationId) {
        return Api.put(`${END_POINT.FLIGHTS}/${userId}/${vacationId}`, form, {
          headers: { Authorization: token },
        });
      },
    addUserFlights(token,form,vacationId) {
        return Api.post(`${END_POINT.FLIGHTS}/${vacationId}`, form, {
          headers: { Authorization: token },
        });
      },
   
}
