import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  bellButton: {
    position: "relative",
    width: "34px !important",
    height: "34px !important",
    borderRadius: "8px !important",
    border: "1px solid #e2e8f0 !important",
    padding: "6px !important",
    "&:hover": {
      backgroundColor: "#f0fdfa !important",
      borderColor: "#99f6e4 !important",
    },
  },
  bellIcon: {
    fontSize: "18px !important",
    color: "#64748b",
  },
  bellIconActive: {
    color: "#0d9488",
  },
  badge: {
    "& .MuiBadge-badge": {
      backgroundColor: "#0d9488",
      color: "#ffffff",
      fontSize: "10px",
      fontWeight: 700,
      minWidth: "16px",
      height: "16px",
      padding: "0 4px",
      top: "2px",
      right: "2px",
    },
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    width: "320px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.12)",
    border: "1px solid #e2e8f0",
    zIndex: 1200,
    overflow: "hidden",
    direction: "rtl",
  },
  dropdownHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    borderBottom: "1px solid #f1f5f9",
  },
  dropdownTitle: {
    fontSize: "13px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
  },
  markReadBtn: {
    fontSize: "11px !important",
    color: "#0d9488 !important",
    textTransform: "none !important",
    padding: "2px 8px !important",
    minWidth: "unset !important",
    "&:hover": {
      backgroundColor: "#f0fdfa !important",
    },
  },
  list: {
    maxHeight: "320px",
    overflowY: "auto",
  },
  notifItem: {
    padding: "12px 16px",
    borderBottom: "1px solid #f8fafc",
    cursor: "pointer",
    transition: "background-color 0.15s",
    "&:hover": {
      backgroundColor: "#f8fafc",
    },
    "&:last-child": {
      borderBottom: "none",
    },
  },
  notifItemUnread: {
    backgroundColor: "#f0fdfa",
    "&:hover": {
      backgroundColor: "#e6faf8",
    },
  },
  notifTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2px",
  },
  notifTitle: {
    fontSize: "12px !important",
    fontWeight: "600 !important",
    color: "#0f172a",
  },
  notifTime: {
    fontSize: "11px !important",
    color: "#94a3b8",
  },
  notifMessage: {
    fontSize: "12px !important",
    color: "#475569",
  },
  notifVacation: {
    fontSize: "11px !important",
    color: "#0d9488",
    marginTop: "2px !important",
  },
  unreadDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#0d9488",
    flexShrink: 0,
    marginTop: "3px",
  },
  emptyState: {
    padding: "32px 16px",
    textAlign: "center",
    fontSize: "13px !important",
    color: "#94a3b8",
  },
}));
