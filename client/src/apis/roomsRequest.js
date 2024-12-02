import { END_POINT } from "../utils/constants";
import Api from "./baseApi";

export default {
  getAll(token,) {
    return Api.get(`/${END_POINT.ROOMS}`, {
      headers: { Authorization: token },
    });
  },
  getAllWithCount(token,) {
    return Api.get(`/${END_POINT.ROOMS}/count`, {
      headers: { Authorization: token },
    });
  },
  assignRoom(token,selectedRooms,familyId) {
    return Api.post(`${END_POINT.USER_ROOMS}`, {selectedRooms,familyId}, {
      headers: { Authorization: token },
    });
  },
  getFamilyRoom(token,familyId) {
    return Api.get(`/${END_POINT.USER_ROOMS}/${familyId}`, {
      headers: { Authorization: token },
    });
  },
  assignRoomToGroupOfUser(token,dataToSend) {
    return Api.post(`${END_POINT.USER_ROOMS}/room/parent`,{dataToSend}, {
      headers: { Authorization: token },
    });
  },
  updateUserToRoom(token,selectedChildRoomId,form) {
    return Api.put(`${END_POINT.USER_ROOMS}/room`,{token,selectedChildRoomId,form}, {
      headers: { Authorization: token },
    });
  },
  updateRoom(token,form) {
    return Api.put(`${END_POINT.ROOMS}`,{token,form}, {
      headers: { Authorization: token },
    });
  },
  assignUserToRoom(token,selectedChildRoomId,form) {
    return Api.post(`${END_POINT.USER_ROOMS}/room`,{token,selectedChildRoomId,form}, {
      headers: { Authorization: token },
    });
  },
  getUserRoom(token,userId) {
    return Api.get(`/${END_POINT.USER_ROOMS}/room/${userId}`, {
      headers: { Authorization: token },
    });
  },
};

