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
    return Api.post(`${END_POINT.ROOMS}`, {selectedRooms,familyId}, {
      headers: { Authorization: token },
    });
  },
  getFamilyRoom(token,familyId) {
    return Api.get(`/${END_POINT.ROOMS}/${familyId}`, {
      headers: { Authorization: token },
    });
  },
  assignRoomToGroupOfUser(token,dataTosend) {
    console.log(dataTosend)
    return Api.post(`${END_POINT.ROOMS}/room/parent`,{dataTosend}, {
      headers: { Authorization: token },
    });
  },
  updateUserToRoom(token,selectedChildRoomId,form) {
    return Api.put(`${END_POINT.ROOMS}/room`,{token,selectedChildRoomId,form}, {
      headers: { Authorization: token },
    });
  },
  assignUserToRoom(token,selectedChildRoomId,form) {
    return Api.post(`${END_POINT.ROOMS}/room`,{token,selectedChildRoomId,form}, {
      headers: { Authorization: token },
    });
  },
  getUserRoom(token,userId) {
    return Api.get(`/${END_POINT.ROOMS}/room/${userId}`, {
      headers: { Authorization: token },
    });
  },
};
// let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/room/${form.user_id}`)
// let response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/room/parent`, { dataTosend })
// response = await axios.put(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/room`, { selectedChildRoomId, form })
//  response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/room`, { selectedChildRoomId, form })