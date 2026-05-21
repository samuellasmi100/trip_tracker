import { createSlice } from "@reduxjs/toolkit";

export const notificationsSlice = createSlice({
  name: "notificationsSlice",
  initialState: {
    notifications: [],   // { id, vacation_id, vacation_name, type, title, message, is_read, created_at }
    unreadCount: 0,
  },
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.is_read).length;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map((n) => ({ ...n, is_read: 1 }));
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});

export const {
  setNotifications,
  addNotification,
  markAllRead,
  clearNotifications,
} = notificationsSlice.actions;

export default notificationsSlice.reducer;
