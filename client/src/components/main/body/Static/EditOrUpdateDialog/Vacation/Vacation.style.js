import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: "28px 32px 24px",
  },
  title: {
    fontSize: "16px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: "24px !important",
  },
  section: {
    marginBottom: "20px",
  },
  sectionLabel: {
    fontSize: "12px !important",
    fontWeight: "600 !important",
    color: "#475569 !important",
    marginBottom: "12px !important",
  },
  fieldGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  fieldItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  inputLabelStyle: {
    color: "#64748b !important",
    fontSize: "12px !important",
    fontWeight: "500 !important",
    marginBottom: "2px",
  },
  textField: {
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 13,
      padding: "8px 12px",
      height: "20px",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": {
        borderColor: "#e2e8f0",
      },
      "&:hover fieldset": {
        borderColor: "#cbd5e1",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0d9488",
      },
    },
  },
  routeCard: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
    padding: "10px 12px 14px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    marginBottom: "8px",
    overflow: "visible",
  },
  routeIndex: {
    fontSize: "11px",
    fontWeight: 600,
    color: "#94a3b8",
    minWidth: "28px",
    textAlign: "center",
    paddingBottom: "10px",
  },
  dateField: {
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 12,
      padding: "8px 10px",
      height: "auto",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "6px",
      backgroundColor: "#ffffff",
      overflow: "visible",
      "& fieldset": {
        borderColor: "#e2e8f0",
      },
      "&:hover fieldset": {
        borderColor: "#cbd5e1",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0d9488",
      },
    },
    "& .MuiInputAdornment-root": {
      marginLeft: 0,
    },
  },
  checkboxLabel: {
    color: "#475569 !important",
    fontSize: "13px !important",
  },
  divider: {
    borderTop: "1px solid #f1f5f9",
    margin: "0 0 20px 0",
    padding: 0,
  },
  actions: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    paddingTop: "8px",
  },
  submitButton: {
    color: "#ffffff !important",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "8px 32px !important",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "8px !important",
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.25) !important",
    "&:hover": {
      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important",
    },
  },
  cancelButton: {
    color: "#64748b !important",
    fontSize: "13px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    padding: "8px 24px !important",
    background: "#f1f5f9 !important",
    borderRadius: "8px !important",
    "&:hover": {
      background: "#e2e8f0 !important",
    },
  },
}));
