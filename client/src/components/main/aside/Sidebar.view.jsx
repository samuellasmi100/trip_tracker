import React from "react";
import {
  AppBar,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useStyles } from "./Sidebar.style";
import { Link, useLocation } from "react-router-dom";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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

function SidebarView({
  logoutButtonFunction,
  handleMenuOpen,
  handleMenuClose,
  menuOpen,
  sidebarOpen,
  toggleSidebar,
  closeSidebar,
  staticExpanded,
  toggleStaticExpanded,
  handleWidgetClick,
  staticDialogType,
}) {
  const classes = useStyles();
  const { pathname } = useLocation();

  const staticSubItems = [
    { key: "rooms", label: "רשימת חדרים", icon: <MeetingRoomIcon className={classes.subMenuIcon} /> },
    { key: "roomsStatus", label: "סטטוס חדרים", icon: <CheckCircleOutlineIcon className={classes.subMenuIcon} /> },
    { key: "payments", label: "תשלומים", icon: <PaymentsIcon className={classes.subMenuIcon} /> },
    { key: "mainGuests", label: "נרשמים", icon: <PeopleAltIcon className={classes.subMenuIcon} /> },
    { key: "guests", label: "כלל האורחים", icon: <GroupsIcon className={classes.subMenuIcon} /> },
    { key: "hotels", label: "מלונות", icon: <ApartmentIcon className={classes.subMenuIcon} /> },
    { key: "vacations", label: "חופשות", icon: <BeachAccessIcon className={classes.subMenuIcon} /> },
    { key: "flights", label: "טיסות", icon: <FlightIcon className={classes.subMenuIcon} /> },
    { key: "generalInformation", label: "מידע כולל", icon: <AssessmentIcon className={classes.subMenuIcon} /> },
  ];

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
          <Typography className={classes.brandText}>Avimor</Typography>
          <Typography className={classes.brandSub}>Tourism Management</Typography>
        </div>

        {/* Navigation section */}
        <div className={classes.navSection} style={{ flex: 1, overflowY: "auto" }}>
          <Typography className={classes.sectionLabel}>ניווט</Typography>

          {/* Workspace */}
          <Link to="/workspace" style={{ textDecoration: "none" }}>
            <div
              className={`${classes.navItem} ${
                pathname.includes("/workspace") ? classes.navItemActive : ""
              }`}
            >
              <div className={classes.navItemIcon}>
                <HomeWorkIcon style={{ fontSize: "20px" }} />
              </div>
              <span className={classes.navItemLabel}>סביבת עבודה</span>
            </div>
          </Link>

          {/* Static / Info - Expandable */}
          <div
            className={`${classes.expandHeader} ${
              pathname.includes("/static") ? classes.expandHeaderActive : ""
            }`}
            onClick={toggleStaticExpanded}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div className={classes.navItemIcon}>
                <InfoOutlinedIcon style={{ fontSize: "20px" }} />
              </div>
              <span className={classes.navItemLabel}>מידע כולל</span>
            </div>
            <ExpandMoreIcon
              className={`${classes.expandArrow} ${
                staticExpanded ? classes.expandArrowOpen : ""
              }`}
            />
          </div>

          {/* Static sub-items accordion */}
          <div
            className={`${classes.subMenuContainer} ${
              staticExpanded ? classes.subMenuOpen : ""
            }`}
          >
            {staticSubItems.map((item) => (
              <div
                key={item.key}
                className={`${classes.subMenuItem} ${
                  pathname.includes("/static") &&
                  staticDialogType === item.key
                    ? classes.subMenuItemActive
                    : ""
                }`}
                onClick={() => handleWidgetClick(item.key)}
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Budgets */}
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
