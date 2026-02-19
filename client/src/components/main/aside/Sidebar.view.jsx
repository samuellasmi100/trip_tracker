import React from "react";
import {
  AppBar,
  IconButton,
  Typography,
} from "@mui/material";
import { useStyles } from "./Sidebar.style";
import { Link, useLocation } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import avimorLogo from "../../../assets/icons/avimor-logo.png";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PaymentsIcon from "@mui/icons-material/Payments";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import GroupsIcon from "@mui/icons-material/Groups";
import ApartmentIcon from "@mui/icons-material/Apartment";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import FlightIcon from "@mui/icons-material/Flight";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HotelIcon from "@mui/icons-material/Hotel";
import SettingsIcon from "@mui/icons-material/Settings";

function SidebarView({
  logoutButtonFunction,
  handleMenuOpen,
  handleMenuClose,
  menuOpen,
  sidebarOpen,
  toggleSidebar,
  closeSidebar,
  linaExpanded,
  toggleLinaExpanded,
  vacationExpanded,
  toggleVacationExpanded,
  handleWidgetClick,
  staticDialogType,
}) {
  const classes = useStyles();
  const { pathname } = useLocation();

  const linaKeys = ["rooms", "roomsStatus", "hotels"];
  const vacationKeys = ["vacations", "generalInformation", "mainGuests", "guests"];

  return (
    <>
      {/* Mobile hamburger button */}
      <IconButton
        className={classes.hamburger}
        onClick={toggleSidebar}
        aria-label="toggle sidebar"
      >
        {sidebarOpen ? (
          <CloseIcon style={{ color: "#1e293b", fontSize: "22px" }} />
        ) : (
          <MenuIcon style={{ color: "#1e293b", fontSize: "22px" }} />
        )}
      </IconButton>

      {/* Mobile overlay */}
      <div
        className={`${classes.overlay} ${sidebarOpen ? classes.overlayVisible : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <AppBar
        className={`${classes.sideBarSx} ${!sidebarOpen ? classes.sidebarHidden : ""}`}
        style={{
          width: "240px",
          minWidth: "240px",
          height: "100vh",
          position: "fixed",
          right: 0,
          left: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Brand area */}
        <div className={classes.brandArea}>
          <img src={avimorLogo} alt="Avimor Tourism" className={classes.brandLogo} />
        </div>

        {/* Navigation section */}
        <div className={classes.navSection} style={{ flex: 1, overflowY: "auto" }}>

          {/* דף הבית */}
          <Link to="/workspace" style={{ textDecoration: "none" }}>
            <div
              className={`${classes.navItem} ${
                pathname.includes("/workspace") ? classes.navItemActive : ""
              }`}
            >
              <div className={classes.navItemIcon}>
                <HomeWorkIcon style={{ fontSize: "20px" }} />
              </div>
              <span className={classes.navItemLabel}>דף הבית</span>
            </div>
          </Link>

          {/* לינה - expandable */}
          <div
            className={`${classes.expandHeader} ${
              pathname.includes("/static") && linaKeys.includes(staticDialogType) ? classes.expandHeaderActive : ""
            }`}
            onClick={toggleLinaExpanded}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className={classes.navItemIcon}>
                <HotelIcon style={{ fontSize: "20px" }} />
              </div>
              <span className={classes.navItemLabel}>לינה</span>
            </div>
            <ExpandMoreIcon
              className={`${classes.expandArrow} ${linaExpanded ? classes.expandArrowOpen : ""}`}
            />
          </div>
          <div className={`${classes.subMenuContainer} ${linaExpanded ? classes.subMenuOpen : ""}`}>
            <div
              className={`${classes.subMenuItem} ${pathname.includes("/static") && staticDialogType === "rooms" ? classes.subMenuItemActive : ""}`}
              onClick={() => handleWidgetClick("rooms")}
            >
              <MeetingRoomIcon className={classes.subMenuIcon} />
              <span>רשימת חדרים</span>
            </div>
            <div
              className={`${classes.subMenuItem} ${pathname.includes("/static") && staticDialogType === "roomsStatus" ? classes.subMenuItemActive : ""}`}
              onClick={() => handleWidgetClick("roomsStatus")}
            >
              <CheckCircleOutlineIcon className={classes.subMenuIcon} />
              <span>סטטוס חדרים</span>
            </div>
            <div
              className={`${classes.subMenuItem} ${pathname.includes("/static") && staticDialogType === "hotels" ? classes.subMenuItemActive : ""}`}
              onClick={() => handleWidgetClick("hotels")}
            >
              <ApartmentIcon className={classes.subMenuIcon} />
              <span>מלונות</span>
            </div>
          </div>

          {/* טיסות - direct link */}
          <div
            className={`${classes.navItem} ${
              pathname.includes("/static") && staticDialogType === "flights" ? classes.navItemActive : ""
            }`}
            onClick={() => handleWidgetClick("flights")}
          >
            <div className={classes.navItemIcon}>
              <FlightIcon style={{ fontSize: "20px" }} />
            </div>
            <span className={classes.navItemLabel}>טיסות</span>
          </div>

          {/* תשלומים - direct link */}
          <div
            className={`${classes.navItem} ${
              pathname.includes("/static") && staticDialogType === "payments" ? classes.navItemActive : ""
            }`}
            onClick={() => handleWidgetClick("payments")}
          >
            <div className={classes.navItemIcon}>
              <PaymentsIcon style={{ fontSize: "20px" }} />
            </div>
            <span className={classes.navItemLabel}>תשלומים</span>
          </div>

          {/* ניהול חופשה - expandable */}
          <div
            className={`${classes.expandHeader} ${
              pathname.includes("/static") && vacationKeys.includes(staticDialogType) ? classes.expandHeaderActive : ""
            }`}
            onClick={toggleVacationExpanded}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className={classes.navItemIcon}>
                <SettingsIcon style={{ fontSize: "20px" }} />
              </div>
              <span className={classes.navItemLabel}>ניהול חופשה</span>
            </div>
            <ExpandMoreIcon
              className={`${classes.expandArrow} ${vacationExpanded ? classes.expandArrowOpen : ""}`}
            />
          </div>
          <div className={`${classes.subMenuContainer} ${vacationExpanded ? classes.subMenuOpen : ""}`}>
            <div
              className={`${classes.subMenuItem} ${pathname.includes("/static") && staticDialogType === "vacations" ? classes.subMenuItemActive : ""}`}
              onClick={() => handleWidgetClick("vacations")}
            >
              <BeachAccessIcon className={classes.subMenuIcon} />
              <span>חופשות</span>
            </div>
            <div
              className={`${classes.subMenuItem} ${pathname.includes("/static") && staticDialogType === "generalInformation" ? classes.subMenuItemActive : ""}`}
              onClick={() => handleWidgetClick("generalInformation")}
            >
              <AssessmentIcon className={classes.subMenuIcon} />
              <span>מידע כולל</span>
            </div>
            <div
              className={`${classes.subMenuItem} ${pathname.includes("/static") && staticDialogType === "mainGuests" ? classes.subMenuItemActive : ""}`}
              onClick={() => handleWidgetClick("mainGuests")}
            >
              <PeopleAltIcon className={classes.subMenuIcon} />
              <span>נרשמים</span>
            </div>
            <div
              className={`${classes.subMenuItem} ${pathname.includes("/static") && staticDialogType === "guests" ? classes.subMenuItemActive : ""}`}
              onClick={() => handleWidgetClick("guests")}
            >
              <GroupsIcon className={classes.subMenuIcon} />
              <span>כלל האורחים</span>
            </div>
          </div>

          {/* תקציב */}
          <Link to="/budgets" style={{ textDecoration: "none" }}>
            <div
              className={`${classes.navItem} ${
                pathname.includes("/budgets") ? classes.navItemActive : ""
              }`}
            >
              <div className={classes.navItemIcon}>
                <AnalyticsIcon style={{ fontSize: "20px" }} />
              </div>
              <span className={classes.navItemLabel}>תקציב</span>
            </div>
          </Link>
        </div>

        {/* Bottom section */}
        <div className={classes.bottomSection}>
          <div className={classes.logoutItem} onClick={logoutButtonFunction}>
            <LogoutIcon style={{ fontSize: "20px" }} />
            <span className={classes.navItemLabel}>התנתקות</span>
          </div>
        </div>
      </AppBar>
    </>
  );
}

export default SidebarView;
