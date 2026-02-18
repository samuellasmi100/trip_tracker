import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  headerBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "48px",
    padding: "0 16px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    gap: "12px",
    flexShrink: 0,
    "@media (max-width: 1024px)": {
      paddingRight: "52px",
    },
  },

  /* Right section - vacation selector */
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: "0 0 auto",
  },
  vacationSelect: {
    height: "32px",
    minWidth: "150px",
    borderRadius: "8px !important",
    "&.MuiOutlinedInput-root": {
      color: "#1e293b !important",
      fontSize: "13px",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e2e8f0",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0d9488",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#0d9488",
      fontSize: "18px",
    },
    "@media (max-width: 600px)": {
      minWidth: "100px",
    },
  },
  selectedMenuItem: {
    backgroundColor: "#ffffff !important",
    color: "#1e293b !important",
    fontSize: "13px !important",
    "&.Mui-selected": {
      backgroundColor: "#f0fdfa !important",
      "&:hover": {
        backgroundColor: "#ccfbf1 !important",
      },
    },
    "&:hover": {
      backgroundColor: "#f8fafc !important",
    },
  },
  statsChips: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    "@media (max-width: 600px)": {
      display: "none",
    },
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    padding: "2px 8px",
    backgroundColor: "#f0fdfa",
    borderRadius: "10px",
    border: "1px solid #ccfbf1",
  },
  chipHideMobile: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
    padding: "2px 8px",
    backgroundColor: "#f0fdfa",
    borderRadius: "10px",
    border: "1px solid #ccfbf1",
    "@media (max-width: 768px)": {
      display: "none",
    },
  },
  chipWarning: {
    display: "flex",
    alignItems: "center",
    padding: "2px 8px",
    backgroundColor: "#fef2f2",
    borderRadius: "10px",
    border: "1px solid #fecaca",
  },
  chipIcon: {
    fontSize: "12px !important",
    color: "#0d9488",
  },
  chipText: {
    fontSize: "11px !important",
    fontWeight: "500 !important",
    color: "#0f766e",
    fontFamily: "'Inter', sans-serif !important",
    whiteSpace: "nowrap",
  },
  chipTextWarning: {
    fontSize: "11px !important",
    fontWeight: "600 !important",
    color: "#ef4444",
    fontFamily: "'Inter', sans-serif !important",
    whiteSpace: "nowrap",
  },

  /* Center - page title */
  pageTitle: {
    fontSize: "15px !important",
    fontWeight: "600 !important",
    color: "#1e293b",
    fontFamily: "'Inter', sans-serif !important",
    "@media (max-width: 480px)": {
      fontSize: "13px !important",
    },
  },

  /* Left section - user */
  leftSection: {
    display: "flex",
    alignItems: "center",
    flex: "0 0 auto",
  },
  avatar: {
    width: "30px !important",
    height: "30px !important",
    backgroundColor: "#e2e8f0 !important",
    color: "#64748b !important",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#cbd5e1 !important",
    },
  },

  /* Legacy */
  noVacation: {
    fontSize: "13px !important",
    color: "#94a3b8",
    fontStyle: "italic",
  },
  inputLabelStyle: {
    color: "#94a3b8 !important",
    fontSize: "15px",
  },
  selectOutline: {
    height: "38px",
    width: "200px",
    borderRadius: "10px",
  },
}));
