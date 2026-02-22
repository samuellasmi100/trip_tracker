import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f766e 0%, #0d9488 50%, #14b8a6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px 16px",
    direction: "rtl",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)",
    padding: "40px 36px 32px",
    width: "100%",
    maxWidth: "480px",
  },
  logoArea: {
    textAlign: "center",
    marginBottom: "24px",
  },
  brandName: {
    fontSize: "20px !important",
    fontWeight: "800 !important",
    color: "#0d9488",
    letterSpacing: "-0.3px",
  },
  brandSub: {
    fontSize: "13px !important",
    color: "#64748b",
    marginTop: "2px !important",
  },
  divider: {
    width: "40px",
    height: "3px",
    background: "linear-gradient(90deg, #0d9488, #14b8a6)",
    borderRadius: "2px",
    margin: "12px auto 24px",
  },
  title: {
    fontSize: "22px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    textAlign: "center",
    marginBottom: "6px !important",
  },
  subtitle: {
    fontSize: "14px !important",
    color: "#64748b",
    textAlign: "center",
    marginBottom: "28px !important",
    lineHeight: "1.5 !important",
  },
  fieldGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    marginBottom: "14px",
  },
  fieldGroupFull: {
    marginBottom: "14px",
  },
  fieldItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: "12px !important",
    fontWeight: "600 !important",
    color: "#475569",
  },
  textField: {
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 14,
      padding: "10px 14px",
      textAlign: "right",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#cbd5e1" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  submitButton: {
    width: "100%",
    marginTop: "8px !important",
    padding: "13px !important",
    color: "#ffffff !important",
    fontSize: "15px !important",
    fontWeight: "700 !important",
    textTransform: "none !important",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "10px !important",
    boxShadow: "0 4px 16px rgba(13, 148, 136, 0.35) !important",
    "&:hover": {
      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important",
    },
    "&:disabled": {
      background: "#e2e8f0 !important",
      color: "#94a3b8 !important",
      boxShadow: "none !important",
    },
  },
  successCard: {
    textAlign: "center",
    padding: "16px 0",
  },
  successIcon: {
    fontSize: "56px !important",
    color: "#0d9488",
    marginBottom: "12px !important",
  },
  successTitle: {
    fontSize: "22px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    marginBottom: "10px !important",
  },
  successText: {
    fontSize: "14px !important",
    color: "#64748b",
    lineHeight: "1.6 !important",
  },
  required: {
    color: "#ef4444",
    marginRight: "2px",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "12px !important",
    color: "#94a3b8",
  },
}));
