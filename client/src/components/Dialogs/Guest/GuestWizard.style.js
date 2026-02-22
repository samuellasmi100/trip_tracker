import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  /* ===== WRAPPER ===== */
  wrapper: {
    padding: "32px 36px 24px",
    direction: "rtl",
  },

  /* ===== STEPPER (addFamily only) ===== */
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
    "& .MuiStepConnector-root": {
      display: "none",
    },
  },

  /* ===== SIDE NAV LAYOUT (addParent / addChild) ===== */
  sideNavWrapper: {
    display: "flex",
    direction: "rtl",
    height: "calc(90vh - 40px)",
    overflow: "hidden",
  },
  sideNav: {
    width: "150px",
    flexShrink: 0,
    backgroundColor: "#f8fafc",
    borderLeft: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    paddingTop: "12px",
    "@media (max-width: 600px)": {
      width: "100%",
      flexDirection: "row",
      borderLeft: "none",
      borderBottom: "1px solid #e2e8f0",
      paddingTop: 0,
      overflowX: "auto",
    },
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 16px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: 500,
    color: "#64748b",
    borderRight: "3px solid transparent",
    transition: "all 150ms ease",
    userSelect: "none",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: "#f1f5f9",
      color: "#475569",
    },
    "@media (max-width: 600px)": {
      borderRight: "none",
      borderBottom: "2px solid transparent",
      padding: "10px 16px",
      fontSize: "12px",
    },
  },
  navItemActive: {
    backgroundColor: "rgba(13, 148, 136, 0.08) !important",
    borderRightColor: "#0d9488 !important",
    color: "#0d9488 !important",
    fontWeight: "600 !important",
    "@media (max-width: 600px)": {
      borderRightColor: "transparent !important",
      borderBottomColor: "#0d9488 !important",
    },
  },
  sideNavContentArea: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
    minHeight: 0,
  },
  sideNavContentScroll: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    padding: "32px 28px",
    "&::-webkit-scrollbar": {
      width: "5px",
    },
    "&::-webkit-scrollbar-track": {
      background: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#cbd5e1",
      borderRadius: "4px",
    },
  },
  sideNavActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "10px",
    padding: "12px 22px",
    borderTop: "1px solid #f1f5f9",
    flexShrink: 0,
  },

  /* ===== STEP CONTENT (addFamily / edit) ===== */
  stepContent: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "4px",
  },

  /* ===== SECTION CARD ===== */
  sectionCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "24px 28px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "13px !important",
    fontWeight: "600 !important",
    color: "#475569 !important",
    marginBottom: "20px !important",
  },

  /* ===== FORM GRID ===== */
  fieldGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px 24px",
    "@media (max-width: 600px)": {
      gridTemplateColumns: "1fr",
    },
  },
  fieldGroupThreeCol: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "20px 24px",
    "@media (max-width: 700px)": {
      gridTemplateColumns: "1fr 1fr",
    },
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr",
    },
  },
  fieldItem: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  fieldItemFull: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    gridColumn: "1 / -1",
  },

  /* ===== LABELS ===== */
  inputLabelStyle: {
    color: "#475569 !important",
    fontSize: "12.5px !important",
    fontWeight: "500 !important",
    marginBottom: "2px",
  },

  /* ===== TEXT FIELDS ===== */
  textField: {
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 14,
      padding: "10px 14px",
      height: "22px",
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
    "& .MuiInputBase-input::placeholder": {
      color: "#94a3b8",
      opacity: 1,
    },
  },
  dateField: {
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 13,
      padding: "10px 14px",
      height: "22px",
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

  /* ===== PHONE ROW ===== */
  phoneRow: {
    display: "flex",
    gap: "10px",
    alignItems: "flex-end",
  },
  phoneField: {
    flex: 1,
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 14,
      padding: "10px 14px",
      height: "22px",
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
    height: "42px",
    minWidth: "85px",
    "&.MuiOutlinedInput-root": {
      borderRadius: "8px",
      color: "#1e293b !important",
      fontSize: "14px",
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
    height: "42px",
    "&.MuiOutlinedInput-root": {
      borderRadius: "8px",
      color: "#1e293b !important",
      fontSize: "14px",
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
    fontSize: "12.5px !important",
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
      fontSize: "12.5px !important",
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

  /* ===== FLIGHT DETAILS ===== */
  flightEmptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 20px",
    backgroundColor: "#f8fafc",
    borderRadius: "12px",
    border: "1px dashed #cbd5e1",
  },
  flightSectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "16px",
  },
  flightRowTitle: {
    fontSize: "13px !important",
    fontWeight: "600 !important",
    color: "#334155 !important",
  },
  flightRowDivider: {
    borderTop: "1px solid #e2e8f0",
    margin: "22px 0",
  },
  flightEmptyHint: {
    textAlign: "center",
    padding: "16px 0 4px",
  },

  /* ===== ACTIONS ===== */
  actions: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    paddingTop: "20px",
    borderTop: "1px solid #f1f5f9",
    marginTop: "8px",
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
  continueButton: {
    color: "#0d9488 !important",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "9px 24px !important",
    background: "#f0fdfa !important",
    border: "1px solid #0d9488 !important",
    borderRadius: "8px !important",
    "&:hover": {
      background: "#ccfbf1 !important",
    },
  },
  backButton: {
    color: "#64748b !important",
    fontSize: "13px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    padding: "9px 24px !important",
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
    padding: "9px 20px !important",
    background: "transparent !important",
    borderRadius: "8px !important",
    "&:hover": {
      background: "#f8fafc !important",
      color: "#64748b !important",
    },
  },
}));
