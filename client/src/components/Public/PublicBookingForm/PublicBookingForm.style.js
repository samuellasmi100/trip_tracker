import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  page: {
    minHeight: "100vh",
    backgroundColor: "#f1f5f9",
    fontFamily: "'Segoe UI', 'Arial', sans-serif",
    direction: "rtl",
  },
  centeredPage: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f5f9",
  },
  // Header
  header: {
    background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)",
    padding: "28px 24px 20px",
    textAlign: "center",
    color: "#fff",
  },
  logoText: {
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.05em",
    opacity: 0.85,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: "22px",
    fontWeight: 700,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: "15px",
    opacity: 0.9,
  },
  // Container
  container: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "20px 16px 40px",
  },
  // Section
  section: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "20px",
    marginBottom: "16px",
  },
  sectionTitle: {
    fontSize: "14px !important",
    fontWeight: "700 !important",
    color: "#0f766e !important",
    marginBottom: "14px !important",
    textTransform: "none !important",
  },
  sectionTitleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "14px",
  },
  // Fields
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr",
    },
  },
  guestGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr",
    },
  },
  field: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontSize: "14px",
      backgroundColor: "#fafafa",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#0d9488" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#0d9488",
    },
  },
  inputBase: {
    fontSize: "14px",
  },
  label: {
    fontSize: "13px",
  },
  // Guest card
  guestCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "14px",
    marginBottom: "12px",
    backgroundColor: "#fafafa",
  },
  guestCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  guestCardTitle: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#475569",
  },
  removeGuestBtn: {
    color: "#ef4444 !important",
    padding: "2px !important",
  },
  addGuestBtn: {
    color: "#0d9488 !important",
    fontSize: "13px !important",
    textTransform: "none !important",
    "& .MuiButton-startIcon": {
      marginLeft: "4px",
      marginRight: 0,
    },
  },
  radioLabel: {
    "& .MuiFormControlLabel-label": {
      fontSize: "14px",
      color: "#374151",
    },
  },
  // Submit
  submitBtn: {
    backgroundColor: "#0d9488 !important",
    color: "#fff !important",
    borderRadius: "10px !important",
    padding: "12px 0 !important",
    fontSize: "16px !important",
    fontWeight: "600 !important",
    marginTop: "8px !important",
    transition: "background 0.2s !important",
    "&:hover": {
      backgroundColor: "#0f766e !important",
    },
    "&.Mui-disabled": {
      backgroundColor: "#94a3b8 !important",
      color: "#fff !important",
    },
  },
  submitError: {
    color: "#ef4444",
    fontSize: "13px",
    textAlign: "center",
    marginBottom: "8px",
    padding: "8px 12px",
    backgroundColor: "#fef2f2",
    borderRadius: "8px",
    border: "1px solid #fecaca",
  },
  // Success card
  successCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #dcfce7",
    padding: "32px 24px",
    textAlign: "center",
    marginBottom: "16px",
  },
  successTitle: {
    fontSize: "20px",
    fontWeight: 700,
    color: "#166534",
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: "14px",
    color: "#4b5563",
    lineHeight: 1.6,
  },
  // Summary card (already submitted view)
  summaryCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    padding: "20px",
  },
  summaryRow: {
    fontSize: "14px",
    color: "#374151",
    marginBottom: "6px",
    lineHeight: 1.5,
  },
  summaryLabel: {
    fontWeight: 600,
    marginLeft: "4px",
  },
  guestSummaryRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#374151",
    marginBottom: "4px",
  },
  guestIndex: {
    fontWeight: 600,
    color: "#0d9488",
    minWidth: "20px",
  },
  guestDetail: {
    color: "#64748b",
    fontSize: "12px",
    marginRight: "8px",
  },
  // Error card
  errorCard: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #fecaca",
    padding: "32px 24px",
    textAlign: "center",
    maxWidth: 360,
    width: "100%",
  },
  errorIcon: {
    fontSize: "36px",
    marginBottom: "12px",
  },
  errorText: {
    fontSize: "15px",
    color: "#7f1d1d",
    margin: 0,
  },
}));
