import { END_POINT } from "../utils/constants";
import Api from "./baseApi";
export default {

    getAll(token) {
        return Api.get(`/${END_POINT.REGIONS}`, {
            headers: { Authorization: token },
          })
    },
    getRegionUserById(token,id) {
        return Api.get(`/${END_POINT.REGIONS}/${id}`, {
            headers: { Authorization: token },
          })
    },
    getClientUserRegions(token,viewAsClientUserId){
        return Api.get(`/${END_POINT.REGIONS}/${END_POINT.CLIENT_USER_REGION}/${viewAsClientUserId}`, {
            headers: { Authorization: token },
          })
    },
    getBondByRegionId(token,id) {
        return Api.get(`/${END_POINT.REGIONS}/${END_POINT.BOND}/${id}`, {
            headers: { Authorization: token },
          })
    },
}