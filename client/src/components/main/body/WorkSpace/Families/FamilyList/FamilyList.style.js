import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  /* ===== PAGE CONTAINER ===== */
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    padding: "10px 16px",
    height: "calc(100vh - 48px)",
    boxSizing: "border-box",
    "@media (max-width: 600px)": {
      padding: "8px",
      gap: "6px",
    },
  },

  /* ===== TABLE CARD ===== */
  tableCard: {
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
  },
  tableToolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 14px",
    borderBottom: "1px solid #f1f5f9",
    backgroundColor: "#fafbfc",
    gap: "10px",
    flexShrink: 0,
    "@media (max-width: 600px)": {
      flexWrap: "wrap",
      padding: "6px 10px",
    },
  },
  tableTitle: {
    fontSize: "15px !important",
    fontWeight: "600 !important",
    color: "#1e293b !important",
    fontFamily: "'Inter', sans-serif !important",
    whiteSpace: "nowrap",
  },
  toolbarActions: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  tableWrap: {
    flex: 1,
    overflow: "auto",
    minHeight: 0,
  },

  /* ===== TABLE STYLES ===== */
  dataTableBody: {
    "& tr:nth-of-type(odd)": {
      backgroundColor: "#ffffff",
    },
    "& tr:nth-of-type(even)": {
      backgroundColor: "#f8fafc",
    },
    "& tr": {
      cursor: "pointer",
      transition: "background-color 120ms ease",
      "&:hover": {
        backgroundColor: "#f0fdfa !important",
      },
    },
  },
  dataTableCell: {
    fontSize: "13px !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    borderBottom: "1px solid #f1f5f9 !important",
    padding: "8px 6px !important",
    whiteSpace: "nowrap",
  },
  familyNameCell: {
    fontSize: "13px !important",
    color: "#0f766e !important",
    fontWeight: "600 !important",
    textAlign: "center !important",
    borderBottom: "1px solid #f1f5f9 !important",
    padding: "8px 6px !important",
    cursor: "pointer",
    "&:hover": {
      color: "#0d9488 !important",
      textDecoration: "underline",
    },
  },
  headerTableRow: {
    fontSize: "12px !important",
    color: "#64748b !important",
    textAlign: "center !important",
    borderBottom: "2px solid #e2e8f0 !important",
    fontWeight: "600 !important",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    whiteSpace: "nowrap",
    padding: "8px 6px !important",
    "&.MuiTableCell-stickyHeader": {
      backgroundColor: "#ffffff !important",
    },
  },
  redText: {
    color: "#ef4444 !important",
    fontWeight: "700 !important",
  },
  statusBadge: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px !important",
    fontWeight: "600 !important",
    lineHeight: "16px",
  },
  statusOk: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a !important",
  },
  statusWarning: {
    backgroundColor: "#fefce8",
    color: "#ca8a04 !important",
  },

  /* ===== PAYMENT STATUS ===== */
  paymentCell: {
    cursor: "pointer !important",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  paymentNone: {
    color: "#94a3b8",
    fontStyle: "italic",
    fontSize: "11px",
  },
  paymentUnpaid: {
    backgroundColor: "#fef2f2 !important",
    color: "#ef4444 !important",
  },
  paymentPartial: {
    backgroundColor: "#fffbeb !important",
    color: "#d97706 !important",
  },
  paymentPaid: {
    backgroundColor: "#f0fdf4 !important",
    color: "#16a34a !important",
  },

  /* ===== SEARCH FIELD ===== */
  searchField: {
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 13,
      width: "120px",
      padding: "6px 12px",
      height: "18px",
      "@media (max-width: 600px)": {
        width: "80px",
      },
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#e2e8f0",
      },
      "&:hover fieldset": {
        borderColor: "#0d9488",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0d9488",
      },
    },
  },

  /* ===== DRAWER OVERLAY ===== */
  drawerOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15, 23, 42, 0.35)",
    zIndex: 1400,
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.25s ease",
  },
  drawerOverlayOpen: {
    opacity: 1,
    pointerEvents: "auto",
  },

  /* ===== DRAWER ===== */
  drawer: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: "40%",
    maxWidth: "560px",
    backgroundColor: "#ffffff",
    boxShadow: "6px 0 24px rgba(0, 0, 0, 0.1)",
    zIndex: 1500,
    display: "flex",
    flexDirection: "column",
    transform: "translateX(-100%)",
    transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    "@media (max-width: 1024px)": {
      width: "70%",
      maxWidth: "none",
    },
    "@media (max-width: 768px)": {
      width: "100%",
      maxWidth: "none",
    },
  },
  drawerOpen: {
    transform: "translateX(0)",
  },

  /* ===== DRAWER HEADER ===== */
  drawerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 16px",
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#fafbfc",
    flexShrink: 0,
  },
  drawerTitleArea: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  drawerTitle: {
    fontSize: "15px !important",
    fontWeight: "700 !important",
    color: "#1e293b !important",
    fontFamily: "'Inter', sans-serif !important",
  },
  drawerSubtitle: {
    fontSize: "12px !important",
    color: "#94a3b8 !important",
    fontFamily: "'Inter', sans-serif !important",
  },
  drawerActions: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  drawerCloseBtn: {
    width: "30px !important",
    height: "30px !important",
    borderRadius: "8px !important",
    backgroundColor: "#f1f5f9 !important",
    "&:hover": {
      backgroundColor: "#e2e8f0 !important",
    },
  },

  /* ===== DRAWER BODY ===== */
  drawerBody: {
    flex: 1,
    overflowY: "auto",
    minHeight: 0,
  },
  drawerGuestTable: {
    "& .MuiTableCell-root": {
      padding: "7px 6px !important",
      fontSize: "13px !important",
    },
  },
  drawerEmpty: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 16px",
    gap: "8px",
  },
  drawerEmptyText: {
    fontSize: "14px !important",
    color: "#94a3b8 !important",
    fontFamily: "'Inter', sans-serif !important",
  },

  /* ===== ROOMS COLUMN ===== */
  roomsBadge: {
    display: "inline-block",
    fontSize: "12px",
    color: "#475569",
    cursor: "default",
  },
  roomsBadgeHighlight: {
    backgroundColor: "#f0fdfa",
    color: "#0f766e !important",
    fontWeight: 600,
    padding: "2px 8px",
    borderRadius: "10px",
    border: "1px solid #99f6e4",
  },

  /* ===== EDIT FAMILY DIALOG ===== */
  editFamilyDialogPaper: {
    borderRadius: "14px !important",
    minWidth: "400px !important",
    maxWidth: "480px !important",
    direction: "rtl",
  },
  editFamilyTitle: {
    fontSize: "15px !important",
    fontWeight: "700 !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    padding: "18px 24px 8px !important",
    fontFamily: "'Inter', sans-serif !important",
  },
  editFamilyContent: {
    padding: "8px 24px 16px !important",
  },
  editFamilyFieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  editFamilyDateRow: {
    display: "flex",
    gap: "12px",
    "& > *": {
      flex: 1,
    },
  },
  editFamilyFieldItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  editFamilyLabel: {
    fontSize: "12px !important",
    fontWeight: "600 !important",
    color: "#64748b !important",
  },
  editFamilyField: {
    "& .MuiInputBase-input": {
      fontSize: 13,
      padding: "8px 12px",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#0d9488" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  editFamilyActions: {
    justifyContent: "center !important",
    gap: "10px !important",
    padding: "8px 24px 18px !important",
  },
  editFamilySaveBtn: {
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    color: "#ffffff !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "8px 28px !important",
    boxShadow: "0 2px 8px rgba(13,148,136,0.25) !important",
    "&:hover": {
      boxShadow: "0 4px 12px rgba(13,148,136,0.35) !important",
    },
  },
  editFamilyCancelBtn: {
    backgroundColor: "#f1f5f9 !important",
    color: "#64748b !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    padding: "8px 24px !important",
    "&:hover": {
      backgroundColor: "#e2e8f0 !important",
    },
  },

}));
