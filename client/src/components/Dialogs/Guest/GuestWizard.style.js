import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  /* ===== WRAPPER ===== */
  wrapper: {
    padding: "24px 32px 20px",
    direction: "rtl",
  },

  /* ===== STEPPER ===== */
  stepper: {
    marginBottom: "28px",
    "& .MuiStepLabel-label": {
      fontSize: "12px !important",
      fontWeight: "500 !important",
      color: "#94a3b8 !important",
      fontFamily: "inherit !important",
    },
    "& .MuiStepLabel-label.Mui-active": {
      color: "#0d9488 !important",
      fontWeight: "600 !important",
    },
    "& .MuiStepLabel-label.Mui-completed": {
      color: "#0d9488 !important",
      fontWeight: "600 !important",
    },
    "& .MuiStepIcon-root": {
      color: "#e2e8f0 !important",
      fontSize: "28px !important",
    },
    "& .MuiStepIcon-root.Mui-active": {
      color: "#0d9488 !important",
    },
    "& .MuiStepIcon-root.Mui-completed": {
      color: "#0d9488 !important",
    },
    "& .MuiStepConnector-line": {
      borderColor: "#e2e8f0",
    },
    "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line": {
      borderColor: "#0d9488",
    },
    "& .MuiStepConnector-root.Mui-completed .MuiStepConnector-line": {
      borderColor: "#0d9488",
    },
  },

  /* ===== STEP CONTENT ===== */
  stepContent: {
    display: "flex",
    flexDirection: "column",
  },

  /* ===== SECTION CARD ===== */
  sectionCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "10px",
    border: "1px solid #e2e8f0",
    padding: "20px 24px",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "13px !important",
    fontWeight: "600 !important",
    color: "#475569 !important",
    marginBottom: "16px !important",
  },

  /* ===== FORM GRID ===== */
  fieldGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px 20px",
    "@media (max-width: 600px)": {
      gridTemplateColumns: "1fr",
    },
  },
  fieldGroupThreeCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "14px 20px",
    "@media (max-width: 600px)": {
      gridTemplateColumns: "1fr",
    },
  },
  fieldItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  fieldItemFull: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    gridColumn: "1 / -1",
  },

  /* ===== LABELS ===== */
  inputLabelStyle: {
    color: "#64748b !important",
    fontSize: "12px !important",
    fontWeight: "500 !important",
    marginBottom: "2px",
  },

  /* ===== TEXT FIELDS ===== */
  textField: {
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 13,
      padding: "8px 12px",
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
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#94a3b8",
      backgroundColor: "#f8fafc",
    },
    "& .MuiOutlinedInput-root.Mui-disabled": {
      "& fieldset": {
        borderColor: "#f1f5f9",
      },
    },
  },
  dateField: {
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 12,
      padding: "8px 12px",
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
  },

  /* ===== PHONE ROW ===== */
  phoneRow: {
    display: "flex",
    gap: "8px",
    alignItems: "flex-end",
  },
  phoneField: {
    flex: 1,
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 13,
      padding: "8px 12px",
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
  },
  areaCodeSelect: {
    height: "37px",
    minWidth: "80px",
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
  menuItem: {
    fontSize: "13px !important",
    color: "#1e293b !important",
    "&.Mui-selected": {
      backgroundColor: "#f0fdfa !important",
    },
    "&:hover": {
      backgroundColor: "#f1f5f9 !important",
    },
  },

  /* ===== SELECT (route, etc.) ===== */
  selectField: {
    height: "37px",
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

  /* ===== SWITCH TOGGLES ===== */
  switchRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px 24px",
    marginTop: "4px",
  },
  switchLabel: {
    color: "#475569 !important",
    fontSize: "12px !important",
    fontWeight: "500 !important",
  },
  switchControl: {
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: "#0d9488",
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: "#0d9488",
    },
    "& .MuiSwitch-track": {
      backgroundColor: "#cbd5e1",
    },
  },

  /* ===== RADIO GROUP ===== */
  radioGroup: {
    display: "flex",
    flexDirection: "row !important",
    flexWrap: "wrap",
    gap: "4px 16px",
    marginTop: "4px",
  },
  radioLabel: {
    "& .MuiFormControlLabel-label": {
      color: "#475569 !important",
      fontSize: "12px !important",
      fontWeight: "500 !important",
    },
    "& .MuiRadio-root": {
      color: "#cbd5e1",
      padding: "6px",
    },
    "& .MuiRadio-root.Mui-checked": {
      color: "#0d9488",
    },
  },

  /* ===== DIVIDER ===== */
  divider: {
    borderTop: "1px solid #f1f5f9",
    margin: "0 0 16px 0",
    padding: 0,
  },

  /* ===== ACTIONS ===== */
  actions: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    paddingTop: "16px",
    borderTop: "1px solid #f1f5f9",
    marginTop: "auto",
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
      boxShadow: "0 4px 12px rgba(13, 148, 136, 0.35) !important",
    },
  },
  backButton: {
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
  cancelButton: {
    color: "#94a3b8 !important",
    fontSize: "13px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    padding: "8px 20px !important",
    background: "transparent !important",
    borderRadius: "8px !important",
    "&:hover": {
      background: "#f8fafc !important",
      color: "#64748b !important",
    },
  },
}));
