import React from "react";
import { makeStyles } from "@mui/styles";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

export const useStyles = makeStyles((theme) => ({
  /* ===== SIDEBAR CONTAINER ===== */
  sideBarSx: {
    right: "0px !important",
    left: "auto !important",
    background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%) !important",
    borderRadius: "0 !important",
    boxShadow: "-4px 0 24px rgba(0, 0, 0, 0.15) !important",
    width: "240px",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
    overflowX: "hidden",
    overflowY: "auto",
    zIndex: 1200,
    "&::-webkit-scrollbar": {
      width: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: "rgba(255,255,255,0.15)",
      borderRadius: "4px",
    },
  },

  sidebarHidden: {
    "@media (max-width: 1024px)": {
      transform: "translateX(100%) !important",
    },
  },

  /* ===== LOGO / BRAND AREA ===== */
  brandArea: {
    padding: "16px 16px 14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    marginBottom: "8px",
    display: "flex",
    justifyContent: "center",
  },
  brandLogo: {
    height: "38px",
    width: "auto",
    objectFit: "contain",
    filter: "brightness(0) invert(1)",
    opacity: 0.92,
  },

  /* ===== NAV SECTION ===== */
  navSection: {
    padding: "0 12px",
  },
  sectionLabel: {
    color: "rgba(255,255,255,0.35)",
    fontSize: "11px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    padding: "16px 12px 6px 12px",
  },

  /* ===== NAV ITEMS ===== */
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.6)",
    textDecoration: "none",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    marginBottom: "2px",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.08)",
      color: "#ffffff",
    },
  },
  navItemActive: {
    backgroundColor: "rgba(13, 148, 136, 0.2) !important",
    color: "#5eead4 !important",
    fontWeight: "600 !important",
    "& svg": {
      fill: "#5eead4 !important",
    },
    "& .MuiSvgIcon-root": {
      color: "#5eead4 !important",
    },
  },
  navItemIcon: {
    width: "20px",
    height: "20px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  navItemLabel: {
    fontSize: "14px",
    fontWeight: 500,
    whiteSpace: "nowrap",
    fontFamily: "'Inter', sans-serif",
  },

  /* ===== EXPANDABLE / ACCORDION ===== */
  expandHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.6)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    marginBottom: "2px",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.08)",
      color: "#ffffff",
    },
  },
  expandHeaderActive: {
    color: "#5eead4 !important",
  },
  expandArrow: {
    color: "rgba(255,255,255,0.3)",
    fontSize: "18px !important",
    transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  expandArrowOpen: {
    transform: "rotate(-180deg)",
  },
  subMenuContainer: {
    overflow: "hidden",
    transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease",
    maxHeight: 0,
    opacity: 0,
  },
  subMenuOpen: {
    maxHeight: "500px",
    opacity: 1,
  },
  subMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 12px 8px 20px",
    marginRight: "12px",
    borderRadius: "8px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.5)",
    fontSize: "13px",
    fontWeight: 400,
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    marginBottom: "1px",
    borderRight: "2px solid transparent",
    "&:hover": {
      backgroundColor: "rgba(255,255,255,0.06)",
      color: "#ffffff",
      borderRight: "2px solid rgba(255,255,255,0.3)",
    },
  },
  subMenuItemActive: {
    backgroundColor: "rgba(13, 148, 136, 0.15) !important",
    color: "#5eead4 !important",
    borderRight: "2px solid #5eead4 !important",
    fontWeight: "500 !important",
  },
  subMenuIcon: {
    fontSize: "16px !important",
    opacity: 0.7,
  },

  /* ===== BOTTOM SECTION ===== */
  bottomSection: {
    padding: "12px",
    borderTop: "1px solid rgba(255,255,255,0.08)",
    marginTop: "auto",
  },
  logoutItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 12px",
    borderRadius: "10px",
    cursor: "pointer",
    color: "rgba(255,255,255,0.5)",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      backgroundColor: "rgba(239, 68, 68, 0.12)",
      color: "#fca5a5",
    },
  },

  /* ===== MOBILE HAMBURGER ===== */
  hamburger: {
    position: "fixed !important",
    top: "4px",
    right: "8px",
    zIndex: 1300,
    backgroundColor: "transparent !important",
    boxShadow: "none !important",
    width: "40px !important",
    height: "40px !important",
    borderRadius: "10px !important",
    display: "none !important",
    "@media (max-width: 1024px)": {
      display: "flex !important",
    },
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 1199,
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.3s ease",
    display: "none",
    "@media (max-width: 1024px)": {
      display: "block",
    },
  },
  overlayVisible: {
    opacity: 1,
    pointerEvents: "auto",
  },

  /* ===== LEGACY CLASSES (kept for compatibility) ===== */
  sideBarIcons: {
    paddingBottom: "20px",
    paddingTop: "20px",
    borderRadius: "0 4px 4px 0",
    transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  logoutToolTip: {
    fontSize: "16px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  tooltip: {
    fontSize: "20px",
  },
}));

export const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: 'white',
    maxWidth: 220,
    height: 20,
    fontSize: theme.typography.pxToRem(20),
    backgroundColor: '#0f766e',
    borderRadius: '8px',
  },
}));
