import Api from './baseApi';
import { END_POINT } from '../utils/constants';

export default {
  getSummary(token, vacationId) {
    return Api.get(`/${END_POINT.DASHBOARD}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getCrossVacation(token, ids) {
    return Api.get(`/${END_POINT.DASHBOARD}/cross?ids=${ids.join(',')}`, {
      headers: { Authorization: token },
    });
  },
};
