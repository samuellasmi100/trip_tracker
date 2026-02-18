import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  headerBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "56px",
    padding: "0 24px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    gap: "16px",
  },

  /* Right section - page title */
  rightSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: "0 0 auto",
  },
  pageTitle: {
    fontSize: "18px !important",
    fontWeight: "700 !important",
    color: "#1e293b",
    fontFamily: "'Inter', sans-serif !important",
    letterSpacing: "-0.01em",
  },

  /* Center section - info chips */
  centerSection: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1,
    justifyContent: "center",
  },
  chip: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "5px 14px",
    backgroundColor: "#f0fdfa",
    borderRadius: "20px",
    border: "1px solid #ccfbf1",
    transition: "all 0.2s ease",
  },
  chipIcon: {
    fontSize: "16px !important",
    color: "#0d9488",
  },
  chipText: {
    fontSize: "13px !important",
    fontWeight: "500 !important",
    color: "#0f766e",
    fontFamily: "'Inter', sans-serif !important",
    whiteSpace: "nowrap",
  },
  noVacation: {
    fontSize: "13px !important",
    color: "#94a3b8",
    fontFamily: "'Inter', sans-serif !important",
    fontStyle: "italic",
  },

  /* Left section - user */
  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flex: "0 0 auto",
  },
  avatar: {
    width: "34px !important",
    height: "34px !important",
    backgroundColor: "#e2e8f0 !important",
    color: "#64748b !important",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#cbd5e1 !important",
    },
  },

  /* Legacy classes kept for compatibility */
  inputLabelStyle: {
    color: "#94a3b8 !important",
    fontSize: "15px",
  },
  selectOutline: {
    height: "38px",
    width: "200px",
    borderRadius: "10px",
    "&.MuiOutlinedInput-root": {
      color: "#1e293b !important",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e2e8f0",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0d9488",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#0d9488",
    },
  },
  selectedMenuItem: {
    backgroundColor: "#ffffff !important",
    color: "#1e293b",
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
}));
