import React, { useState, useEffect } from "react";
import NotificationBellView from "./NotificationBell.view";
import { useDispatch, useSelector } from "react-redux";
import * as notificationsSlice from "../../../../store/slice/notificationsSlice";
import ApiNotifications from "../../../../apis/notificationsRequest";

const NotificationBell = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const unreadCount = useSelector((state) => state.notificationsSlice.unreadCount);
  const notifications = useSelector((state) => state.notificationsSlice.notifications);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications from DB on mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await ApiNotifications.getAll(token);
        dispatch(notificationsSlice.setNotifications(response.data));
      } catch (error) {
        console.log(error);
      }
    };
    if (token) fetchNotifications();
  }, []);

  const handleBellClick = async () => {
    const opening = !isOpen;
    setIsOpen(opening);

    // Mark all as read when opening
    if (opening && unreadCount > 0) {
      try {
        await ApiNotifications.markAllRead(token);
        dispatch(notificationsSlice.markAllRead());
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await ApiNotifications.markAllRead(token);
      dispatch(notificationsSlice.markAllRead());
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickAway = () => {
    setIsOpen(false);
  };

  return (
    <NotificationBellView
      unreadCount={unreadCount}
      notifications={notifications}
      isOpen={isOpen}
      handleBellClick={handleBellClick}
      handleMarkAllRead={handleMarkAllRead}
      handleClickAway={handleClickAway}
    />
  );
};

export default NotificationBell;
