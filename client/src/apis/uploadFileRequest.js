import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  addFile(token,vacationId,formData) {
    return Api.post(`${END_POINT.UPLOADS}/${vacationId}`, formData, {
      headers: { 
        Authorization: token,
        'Content-Type': 'multipart/form-data' 
      },
    });
  },

  getFamilyFiles(token,familyName,vacationId) {
    return Api.get(`/${END_POINT.UPLOADS}/files/${familyName}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },

  deleteFamilyFiles(token,familyName,vacationId,file) {
    return Api.delete(`/${END_POINT.UPLOADS}/files/${familyName}/${vacationId}/${file}`, {
      headers: { Authorization: token },
    });
  },


};
