import React from "react";
import { useState, useCallback, useEffect } from "react";
import SidebarView from "./Sidebar.view";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import * as authSlice from "../../../store/slices/authSlice"
import * as staticSlice from "../../../store/slices/staticSlice"
import * as notificationsSlice from "../../../store/slices/notificationsSlice"
import * as leadsSlice from "../../../store/slices/leadsSlice"
import { disconnectSocket } from "../../../utils/socketService"
import ApiLeads from "../../../apis/leadsRequest"

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 1024);
  const [vacationExpanded, setVacationExpanded] = useState(false);
  const [guestsManagementExpanded, setGuestsManagementExpanded] = useState(false);

  const staticDialogType = useSelector((state) => state.staticSlice.type);
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const followupDueCount = useSelector((state) => state.leadsSlice.followupDueCount);

  // Follow-up due count. The server query is date-relative (followup_date <=
  // CURDATE()), so we must refetch whenever the app could have crossed midnight
  // while open — i.e. when the secretary returns to the tab. Leads widget keeps
  // it fresh on every list refresh via updateLeadsList.
  const refreshDueCount = useCallback(() => {
    const token = sessionStorage.getItem("token");
    if (!token || !vacationId) return;
    ApiLeads.getFollowupDueCount(token, vacationId)
      .then((res) => dispatch(leadsSlice.setFollowupDueCount(res.data?.count ?? 0)))
      .catch((err) => console.log(err));
  }, [vacationId, dispatch]);

  // Runs on sidebar mount and on vacation switch.
  useEffect(() => {
    refreshDueCount();
  }, [refreshDueCount]);

  // Refetch when she returns to the app (tab becomes visible / window refocused),
  // so a badge left open overnight picks up followups that became due at midnight.
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible") refreshDueCount();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", refreshDueCount);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", refreshDueCount);
    };
  }, [refreshDueCount]);


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

  const toggleVacationExpanded = useCallback(() => {
    setVacationExpanded((prev) => !prev);
  }, []);

  const toggleGuestsManagementExpanded = useCallback(() => {
    setGuestsManagementExpanded((prev) => !prev);
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
      vacationExpanded={vacationExpanded}
      toggleVacationExpanded={toggleVacationExpanded}
      guestsManagementExpanded={guestsManagementExpanded}
      toggleGuestsManagementExpanded={toggleGuestsManagementExpanded}
      handleWidgetClick={handleWidgetClick}
      handleDirectNavClick={handleDirectNavClick}
      staticDialogType={staticDialogType}
      followupDueCount={followupDueCount}
    />
  );
}

export default Sidebar;
