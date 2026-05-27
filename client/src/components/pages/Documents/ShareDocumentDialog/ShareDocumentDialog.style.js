import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "16px !important",
    padding: "4px",
    direction: "rtl",
    width: "100%",
    maxWidth: "460px !important",
  },
  title: {
    fontSize: "18px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    paddingBottom: "0 !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  closeBtn: {
    color: "#64748b !important",
    padding: "4px !important",
  },
  body: {
    paddingTop: "12px !important",
  },
  // Recipient input row.
  fieldLabel: {
    fontSize: "12px !important",
    fontWeight: "600 !important",
    color: "#475569",
    marginBottom: "4px !important",
  },
  textField: {
    marginBottom: "4px",
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 14,
      padding: "10px 14px",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#cbd5e1" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  // Caption + expiry note, sit just under the field.
  caption: {
    fontSize: "11px !important",
    color: "#64748b !important",
    marginTop: "4px !important",
    marginBottom: "14px !important",
    textAlign: "right",
  },
  buttonStack: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "4px",
  },
  channelButton: {
    width: "100%",
    padding: "12px !important",
    fontSize: "14px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    borderRadius: "12px !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  whatsappButton: {
    background: "#25d366 !important",
    color: "#ffffff !important",
    boxShadow: "0 4px 14px rgba(37, 211, 102, 0.30) !important",
    "&:hover": { background: "#128c7e !important" },
    "&.Mui-disabled": {
      background: "#e2e8f0 !important",
      color: "#94a3b8 !important",
      boxShadow: "none !important",
    },
  },
  emailButton: {
    background: "#0d9488 !important",
    color: "#ffffff !important",
    boxShadow: "0 4px 14px rgba(13, 148, 136, 0.30) !important",
    "&:hover": { background: "#0f766e !important" },
    "&.Mui-disabled": {
      background: "#e2e8f0 !important",
      color: "#94a3b8 !important",
      boxShadow: "none !important",
    },
  },
  copyButton: {
    background: "#ffffff !important",
    color: "#0f172a !important",
    border: "1.5px solid #0d9488 !important",
    "&:hover": { background: "#f0fdfa !important" },
    "&.Mui-disabled": {
      borderColor: "#e2e8f0 !important",
      color: "#94a3b8 !important",
    },
  },
  loadingText: {
    fontSize: "12px !important",
    color: "#64748b",
    textAlign: "center",
    padding: "10px 0",
  },
  errorText: {
    fontSize: "13px !important",
    color: "#dc2626",
    textAlign: "center",
    padding: "8px 0",
  },
}));
