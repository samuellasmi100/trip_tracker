import React from "react";
import { useState, useCallback } from "react";
import SidebarView from "./Sidebar.view";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import * as authSlice from "../../../store/slice/authSlice"
import * as staticSlice from "../../../store/slice/staticSlice"
import * as notificationsSlice from "../../../store/slice/notificationsSlice"
import { disconnectSocket } from "../../../utils/socketService"

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [linaExpanded, setLinaExpanded] = useState(false);
  const [vacationExpanded, setVacationExpanded] = useState(false);

  const staticDialogType = useSelector((state) => state.staticSlice.type);


  const handleLogOut = () => {
      disconnectSocket();
      dispatch(notificationsSlice.clearNotifications());
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userData");
      delete axios.defaults.headers.common["Authorization"];
      dispatch(authSlice.clearUserData());
  };

  const logoutButtonFunction = async () => {
    try {
        handleLogOut();
        navigate("/");
    } catch (error) {
      console.log(error)
    }
  };

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const toggleLinaExpanded = useCallback(() => {
    setLinaExpanded((prev) => !prev);
  }, []);

  const toggleVacationExpanded = useCallback(() => {
    setVacationExpanded((prev) => !prev);
  }, []);

  const handleWidgetClick = useCallback((widgetName) => {
    // Navigate to /static if not already there
    if (!location.pathname.includes("/static")) {
      navigate("/static");
    }
    // Dispatch the same Redux actions the Static page buttons use
    dispatch(staticSlice.updateDialogType(widgetName));
  }, [dispatch, navigate, location.pathname]);

  const handleDirectNavClick = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  return (
    <SidebarView
      logoutButtonFunction={logoutButtonFunction}
      handleMenuOpen={handleMenuOpen}
      handleMenuClose={handleMenuClose}
      menuOpen={menuOpen}
      sidebarOpen={sidebarOpen}
      toggleSidebar={toggleSidebar}
      closeSidebar={closeSidebar}
      linaExpanded={linaExpanded}
      toggleLinaExpanded={toggleLinaExpanded}
      vacationExpanded={vacationExpanded}
      toggleVacationExpanded={toggleVacationExpanded}
      handleWidgetClick={handleWidgetClick}
      handleDirectNavClick={handleDirectNavClick}
      staticDialogType={staticDialogType}
    />
  );
}

export default Sidebar;
