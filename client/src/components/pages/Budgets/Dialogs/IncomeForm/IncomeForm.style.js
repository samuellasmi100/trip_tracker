import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  root: {
    padding: "24px",
  },
  title: {
    color: "#1e293b",
    fontWeight: "700 !important",
    fontSize: "18px !important",
    marginBottom: "20px !important",
    textAlign: "center",
  },
  formRow: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
    marginBottom: "12px",
  },
  inputLabel: {
    color: "#64748b !important",
    fontSize: "13px !important",
    fontWeight: "500 !important",
    marginBottom: "4px !important",
  },
  selectOutline: {
    height: "38px !important",
    width: "140px",
    borderRadius: "10px !important",
    fontSize: "14px !important",
    color: "#1e293b !important",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0 !important",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#cbd5e1 !important",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#0d9488 !important",
    },
  },
  textField: {
    width: "140px",
    "& .MuiOutlinedInput-root": {
      height: "38px",
      borderRadius: "10px",
      fontSize: "14px",
      color: "#1e293b",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#cbd5e1" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  shortTextField: {
    width: "80px",
    "& .MuiOutlinedInput-root": {
      height: "38px",
      borderRadius: "10px",
      fontSize: "14px",
      color: "#1e293b",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#cbd5e1" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  descriptionField: {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      fontSize: "14px",
      color: "#1e293b",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#cbd5e1" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  paymentsScroll: {
    maxHeight: "180px",
    overflowY: "auto",
    marginTop: "8px",
    "&::-webkit-scrollbar": { width: "4px" },
    "&::-webkit-scrollbar-track": { background: "#f1f5f9" },
    "&::-webkit-scrollbar-thumb": { background: "#cbd5e1", borderRadius: "4px" },
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "20px",
  },
  submitButton: {
    color: "#ffffff !important",
    fontSize: "14px !important",
    textTransform: "none !important",
    padding: "6px 28px !important",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "10px !important",
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.25) !important",
    "&:hover": {
      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important",
    },
  },
  cancelButton: {
    color: "#64748b !important",
    fontSize: "14px !important",
    textTransform: "none !important",
    padding: "6px 28px !important",
    border: "1px solid #e2e8f0 !important",
    borderRadius: "10px !important",
    "&:hover": {
      backgroundColor: "#f8fafc !important",
    },
  },
  selectedMenuItem: {
    fontSize: "14px !important",
    color: "#1e293b !important",
  },
}));
