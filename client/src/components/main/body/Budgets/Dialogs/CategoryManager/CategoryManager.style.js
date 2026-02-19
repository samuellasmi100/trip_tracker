import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  root: {
    padding: "24px",
    minHeight: "400px",
  },
  title: {
    color: "#1e293b",
    fontWeight: "700 !important",
    fontSize: "18px !important",
    marginBottom: "16px !important",
    textAlign: "center",
  },
  tabsContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
    gap: "8px",
  },
  tabButton: {
    color: "#64748b !important",
    fontSize: "13px !important",
    textTransform: "none !important",
    padding: "4px 16px !important",
    border: "1px solid #e2e8f0 !important",
    borderRadius: "8px !important",
    "&:hover": {
      backgroundColor: "#f1f5f9 !important",
    },
  },
  tabButtonActive: {
    color: "#ffffff !important",
    fontSize: "13px !important",
    textTransform: "none !important",
    padding: "4px 16px !important",
    borderRadius: "8px !important",
    backgroundColor: "#0d9488 !important",
    "&:hover": {
      backgroundColor: "#0f766e !important",
    },
  },
  panelContainer: {
    display: "flex",
    gap: "16px",
    height: "320px",
  },
  panel: {
    flex: 1,
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 14px",
    backgroundColor: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },
  panelTitle: {
    color: "#1e293b",
    fontWeight: "600 !important",
    fontSize: "14px !important",
  },
  panelList: {
    flex: 1,
    overflowY: "auto",
    padding: "8px",
    "&::-webkit-scrollbar": { width: "4px" },
    "&::-webkit-scrollbar-track": { background: "#f1f5f9" },
    "&::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: "4px" },
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.15s",
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },
  },
  listItemSelected: {
    backgroundColor: "#f0fdfa !important",
    border: "1px solid #99f6e4",
  },
  listItemText: {
    color: "#1e293b",
    fontSize: "13px !important",
  },
  addInput: {
    "& .MuiOutlinedInput-root": {
      height: "34px",
      borderRadius: "8px",
      fontSize: "13px",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  addRow: {
    display: "flex",
    gap: "6px",
    padding: "8px",
    borderTop: "1px solid #e2e8f0",
  },
  closeButton: {
    display: "flex",
    justifyContent: "center",
    marginTop: "16px",
  },
}));
