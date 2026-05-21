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

  // Initial follow-up due count — runs when sidebar mounts and on vacation
  // switch. Leads widget keeps it fresh on every list refresh via updateLeadsList.
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token || !vacationId) return;
    let cancelled = false;
    ApiLeads.getFollowupDueCount(token, vacationId)
      .then((res) => {
        if (!cancelled) dispatch(leadsSlice.setFollowupDueCount(res.data?.count ?? 0));
      })
      .catch((err) => console.log(err));
    return () => { cancelled = true; };
  }, [vacationId, dispatch]);


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
