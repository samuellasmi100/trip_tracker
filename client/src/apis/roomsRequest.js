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
  // Full board data: rooms + bookings (with family names) + guest assignments + all guests
  getBoardData(token, vacationId) {
    return Api.get(`/${END_POINT.ROOMS}/board/${vacationId}`, {
      headers: { Authorization: token },
    });
  },
  // Server-side family name search for the assignment dialog
  searchFamilies(token, vacationId, q) {
    return Api.get(`${END_POINT.FAMILY}/search/${vacationId}`, {
      headers: { Authorization: token },
      params: { q },
    });
  },
  // Move a family's booking from one room to another
  moveRoom(token, { vacationId, familyId, fromRoomId, toRoomId }) {
    return Api.post(`/${END_POINT.USER_ROOMS}/move`, { vacationId, familyId, fromRoomId, toRoomId }, {
      headers: { Authorization: token },
    });
  },
};

