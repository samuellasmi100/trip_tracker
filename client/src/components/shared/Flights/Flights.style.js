import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  inputLabelStyle: {
    color: "#475569 !important",
    fontSize: "11.5px !important",
    fontWeight: "500 !important",
    marginBottom: "4px",
  },
  textField: {
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 13,
      padding: "7px 12px",
      height: "20px",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
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
    "& .MuiInputBase-input::placeholder": {
      color: "#94a3b8",
      opacity: 1,
    },
  },
  selectOutline: {
    height: "36px",
    "&.MuiOutlinedInput-root": {
      borderRadius: "8px",
      color: "#1e293b !important",
      fontSize: "13px",
      backgroundColor: "#ffffff",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e2e8f0",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#cbd5e1",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0d9488",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#0d9488",
    },
  },
  selectedMenuItem: {
    fontSize: "13px !important",
    color: "#1e293b !important",
    "&.Mui-selected": {
      backgroundColor: "#f0fdfa !important",
    },
    "&:hover": {
      backgroundColor: "#f1f5f9 !important",
    },
  },
  sectionCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "18px 22px",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "12.5px !important",
    fontWeight: "600 !important",
    color: "#475569 !important",
    marginBottom: "14px !important",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  fieldGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px 18px",
    "@media (max-width: 600px)": {
      gridTemplateColumns: "1fr",
    },
  },
  fieldGroupThreeCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "14px 18px",
    "@media (max-width: 700px)": {
      gridTemplateColumns: "1fr 1fr",
    },
  },
  fieldItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  submitButton: {
    color: "#ffffff !important",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "9px 32px !important",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "8px !important",
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.25) !important",
    "&:hover": {
      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important",
      boxShadow: "0 4px 12px rgba(13, 148, 136, 0.35) !important",
    },
  },
  saveCloseButton: {
    color: "#ffffff !important",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "9px 32px !important",
    background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%) !important",
    borderRadius: "8px !important",
    boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25) !important",
    "&:hover": {
      background: "linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%) !important",
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.35) !important",
    },
  },
  cancelButton: {
    color: "#94a3b8 !important",
    fontSize: "13px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    padding: "9px 20px !important",
    background: "transparent !important",
    borderRadius: "8px !important",
    "&:hover": {
      background: "#f8fafc !important",
      color: "#64748b !important",
    },
  },
}));
