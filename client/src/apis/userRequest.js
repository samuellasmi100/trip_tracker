import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  login(body) {
    console.log(`/${END_POINT.LOGIN}`)
    return Api.post(`/${END_POINT.LOGIN}`, body);
  },


 
 
}

  


