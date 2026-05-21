import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  sectionTitle: {
    color: "#64748b",
    fontWeight: "600 !important",
    fontSize: "14px !important",
    marginBottom: "12px !important",
  },
  rateRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "16px",
    justifyContent: "center",
  },
  currencyLabel: {
    color: "#1e293b !important",
    fontSize: "15px !important",
    fontWeight: "600 !important",
    minWidth: "50px",
    textAlign: "right",
  },
  textField: {
    width: "160px",
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
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "24px",
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
}));
