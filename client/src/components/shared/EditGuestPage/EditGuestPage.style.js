import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  /* ===== PAGE WRAPPER (scrollable container inside dialog) ===== */
  pageWrapper: {
    display: "flex",
    flexDirection: "column",
    direction: "rtl",
    height: "calc(90vh - 40px)",
    overflow: "hidden",
  },

  /* ===== TWO-COLUMN LAYOUT ===== */
  layoutWrapper: {
    display: "flex",
    flex: 1,
    minHeight: 0,
    "@media (max-width: 600px)": {
      flexDirection: "column",
    },
  },

  /* ===== SIDE NAV ===== */
  sideNav: {
    width: "150px",
    flexShrink: 0,
    backgroundColor: "#f8fafc",
    borderLeft: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    paddingTop: "12px",
    "@media (max-width: 600px)": {
      width: "100%",
      flexDirection: "row",
      borderLeft: "none",
      borderBottom: "1px solid #e2e8f0",
      paddingTop: 0,
      overflowX: "auto",
      "&::-webkit-scrollbar": {
        height: "2px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#cbd5e1",
        borderRadius: "2px",
      },
    },
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 16px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    color: "#64748b",
    borderRight: "3px solid transparent",
    transition: "all 150ms ease",
    userSelect: "none",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: "#f1f5f9",
      color: "#475569",
    },
    "@media (max-width: 600px)": {
      borderRight: "none",
      borderBottom: "2px solid transparent",
      padding: "10px 16px",
      fontSize: "12px",
    },
  },
  navItemActive: {
    backgroundColor: "rgba(13, 148, 136, 0.08) !important",
    borderRightColor: "#0d9488 !important",
    color: "#0d9488 !important",
    fontWeight: "600 !important",
    "@media (max-width: 600px)": {
      borderRightColor: "transparent !important",
      borderBottomColor: "#0d9488 !important",
    },
  },
  navDirtyDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#f59e0b",
    flexShrink: 0,
    animation: "$pulse 2s infinite",
  },
  "@keyframes pulse": {
    "0%, 100%": { opacity: 1 },
    "50%": { opacity: 0.35 },
  },

  /* ===== CONTENT AREA ===== */
  contentArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
  },
  contentScroll: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "32px 28px",
    "&::-webkit-scrollbar": {
      width: "5px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#cbd5e1",
      borderRadius: "4px",
    },
  },

  /* ===== SUB-SECTION HELPERS ===== */
  subSectionLabel: {
    fontSize: "11px !important",
    fontWeight: "600 !important",
    color: "#94a3b8 !important",
    letterSpacing: "0.5px",
    marginBottom: "12px !important",
    marginTop: "16px !important",
    "&:first-child": {
      marginTop: "0 !important",
    },
  },
  subSectionDivider: {
    borderTop: "1px solid #f1f5f9",
    margin: "16px 0",
  },

  /* ===== SECTION SAVE BUTTON BAR ===== */
  sectionActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "10px",
    padding: "12px 22px",
    borderTop: "1px solid #f1f5f9",
    flexShrink: 0,
  },
  sectionSaveBtn: {
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    color: "#ffffff !important",
    padding: "8px 24px !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    boxShadow: "0 2px 8px rgba(13,148,136,0.25) !important",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(13,148,136,0.35) !important",
    },
    "&.Mui-disabled": {
      opacity: "0.5 !important",
      background: "#cbd5e1 !important",
      boxShadow: "none !important",
      color: "#ffffff !important",
    },
  },
  saveCloseBtn: {
    color: "#0d9488 !important",
    padding: "8px 20px !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    backgroundColor: "#f0fdfa !important",
    border: "1px solid #0d9488 !important",
    "&:hover": {
      backgroundColor: "#ccfbf1 !important",
    },
  },
  closePageButton: {
    backgroundColor: "transparent !important",
    color: "#64748b !important",
    padding: "8px 18px !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    border: "1px solid #e2e8f0 !important",
    "&:hover": {
      backgroundColor: "#f8fafc !important",
    },
  },
  savingBadge: {
    fontSize: "10px !important",
    color: "#0d9488 !important",
    fontWeight: "500 !important",
    backgroundColor: "#f0fdfa",
    padding: "2px 8px",
    borderRadius: "10px",
    marginRight: "8px",
  },

  /* ===== WARNING DIALOG ===== */
  warningDialogPaper: {
    borderRadius: "14px !important",
    padding: "8px !important",
    minWidth: "340px !important",
  },
  warningTitle: {
    fontSize: "14px !important",
    fontWeight: "600 !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    padding: "16px 24px 8px !important",
  },
  warningText: {
    fontSize: "13px !important",
    color: "#64748b !important",
    textAlign: "center !important",
  },
  warningActions: {
    justifyContent: "center !important",
    gap: "10px !important",
    padding: "8px 24px 16px !important",
  },
  warningExitBtn: {
    backgroundColor: "#ef4444 !important",
    color: "#ffffff !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "7px 20px !important",
    "&:hover": {
      backgroundColor: "#dc2626 !important",
    },
  },
  warningSaveBtn: {
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    color: "#ffffff !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "7px 20px !important",
  },
  warningCancelBtn: {
    backgroundColor: "#f1f5f9 !important",
    color: "#64748b !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    padding: "7px 20px !important",
    "&:hover": {
      backgroundColor: "#e2e8f0 !important",
    },
  },
}));
