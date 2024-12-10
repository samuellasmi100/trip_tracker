import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  getAll(token,vacationId) {
    return Api.get(`/${END_POINT.ROOMS}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getRoomAvailable(token,vacationId,startDate,endDate) {
    return Api.get(`/${END_POINT.ROOMS}/${vacationId}/${startDate}/${endDate}`, {
      headers: { Authorization: token },
    });
  },
  getAllWithCount(token,) {
    return Api.get(`/${END_POINT.ROOMS}/count`, {
      headers: { Authorization: token },
    });
  },
  assignRoom(token,selectedRooms,familyId,vacationId,startDate,endDate) {
    return Api.post(`${END_POINT.USER_ROOMS}`, {token,selectedRooms,familyId,vacationId,startDate,endDate}, {
      headers: { Authorization: token },
    });
  },
  getFamilyRoom(token,familyId,vacationId) {
    return Api.get(`/${END_POINT.USER_ROOMS}/${familyId}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  assignRoomToGroupOfUser(token,dataToSend,vacationId) {
    return Api.post(`${END_POINT.USER_ROOMS}/room/parent/${vacationId}`,{dataToSend}, {
      headers: { Authorization: token },
    });
  },
  updateUserToRoom(token,selectedChildRoomId,form,vacationId) {
    return Api.put(`${END_POINT.USER_ROOMS}/room`,{token,selectedChildRoomId,form,vacationId}, {
      headers: { Authorization: token },
    });
  },
  updateRoom(token,form,vacationId) {
    return Api.put(`${END_POINT.ROOMS}/${vacationId}`,{token,form}, {
      headers: { Authorization: token },
    });
  },
  assignUserToRoom(token,selectedChildRoomId,form,vacationId) {
    return Api.post(`${END_POINT.USER_ROOMS}/room`,{token,selectedChildRoomId,form,vacationId}, {
      headers: { Authorization: token },
    });
  },
  getChosenRoom(token,userId,vacationId) {
    return Api.get(`/${END_POINT.USER_ROOMS}/user/${userId}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getUsersChosenRoom(token,familyId,vacationId) {
    return Api.get(`/${END_POINT.USER_ROOMS}/users/${familyId}/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  getUnAndAvailableDates(token,vacationId,startDate,endDate) {
    return Api.get(`/${END_POINT.ROOMS}/room_available/${vacationId}/${startDate}/${endDate}`, {
      headers: { Authorization: token },
    });
  },
};

