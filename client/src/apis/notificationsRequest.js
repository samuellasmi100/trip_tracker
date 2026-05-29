import Api from "./baseApi";

export default {
  getAll(token) {
    return Api.get("/notifications", {
      headers: { Authorization: token },
    });
  },
  markAllRead(token) {
    return Api.put("/notifications/read", {}, {
      headers: { Authorization: token },
    });
  },
  deleteOne(token, id) {
    return Api.delete(`/notifications/${id}`, {
      headers: { Authorization: token },
    });
  },
  deleteAll(token) {
    return Api.delete("/notifications", {
      headers: { Authorization: token },
    });
  },
};
