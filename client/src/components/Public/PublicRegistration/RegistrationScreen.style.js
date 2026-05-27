import { makeStyles } from "@mui/styles";

/**
 * Paper-form-style registration page.
 *
 * Mobile (≤ 699px): single column, every section stacked.
 * Desktop (≥ 700px): the orderer-details block becomes a 2-col grid
 * (read-only meta on one side, editable address fields on the other).
 * Everything else (package, payment, terms, signature) stays full-width
 * so the page reads top-to-bottom like the original PDF.
 */
export const useStyles = makeStyles(() => ({
  // ─── shared section primitives ────────────────────────────────────────────

  section: {
    marginBottom: "22px",
    "&:last-child": { marginBottom: 0 },
  },
  sectionTitle: {
    fontSize: "15px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    marginBottom: "12px !important",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  sectionIcon: {
    fontSize: "20px !important",
    color: "#0d9488",
  },

  // ─── 1. PACKAGE DESCRIPTION (blue accent, near top) ───────────────────────

  packageBox: {
    background: "linear-gradient(180deg, #ecfeff 0%, #f0fdfa 100%)",
    border: "1px solid #99f6e4",
    borderRight: "4px solid #0d9488",
    borderRadius: "12px",
    padding: "16px 18px",
  },
  packageLabel: {
    fontSize: "12px !important",
    fontWeight: "700 !important",
    color: "#0d9488",
    letterSpacing: "0.4px",
    textTransform: "uppercase",
    marginBottom: "6px !important",
  },
  packageText: {
    fontSize: "14px !important",
    color: "#0f172a",
    lineHeight: "1.65 !important",
  },
  packageDates: {
    marginTop: "10px !important",
    fontSize: "14px !important",
    fontWeight: "600 !important",
    color: "#0f172a",
  },
  packageDatesValue: {
    color: "#0d9488",
    marginRight: "6px",
  },

  // ─── 2. ORDERER DETAILS (read-only + editable, 2-col on desktop) ──────────

  ordererGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "18px",
    "@media (min-width: 700px)": {
      gridTemplateColumns: "1fr 1fr",
      gap: "24px",
    },
  },
  ordererBlock: {
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "16px 18px",
  },
  ordererBlockTitle: {
    fontSize: "12px !important",
    fontWeight: "700 !important",
    color: "#64748b",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
    marginBottom: "10px !important",
  },
  readonlyRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    padding: "6px 0",
    borderBottom: "1px solid #e2e8f0",
    "&:last-child": { borderBottom: "none" },
  },
  readonlyLabel: {
    fontSize: "12px !important",
    color: "#64748b",
    fontWeight: "500 !important",
  },
  readonlyValue: {
    fontSize: "14px !important",
    color: "#0f172a",
    fontWeight: "600 !important",
    textAlign: "left",
    direction: "ltr", // keep phones/emails/dates LTR
    maxWidth: "60%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  // ─── editable form fields ─────────────────────────────────────────────────

  editableGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  fieldItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
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

  // ─── 3. PAYMENT BOX ───────────────────────────────────────────────────────

  paymentBox: {
    border: "1.5px solid #0d9488",
    borderRadius: "12px",
    padding: "18px 20px",
    background: "#ffffff",
  },
  paymentTitle: {
    fontSize: "14px !important",
    fontWeight: "700 !important",
    color: "#0d9488",
    marginBottom: "14px !important",
    paddingBottom: "10px",
    borderBottom: "1px solid #ccfbf1",
  },
  paymentMethodRow: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "14px",
    "@media (max-width: 480px)": { gap: "12px" },
  },
  paymentMethodOption: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#475569",
  },
  paymentMethodOptionChecked: {
    color: "#0f172a",
    fontWeight: 700,
  },
  paymentCheckbox: {
    width: "18px",
    height: "18px",
    borderRadius: "4px",
    border: "1.5px solid #cbd5e1",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
  },
  paymentCheckboxChecked: {
    borderColor: "#0d9488",
    background: "#0d9488",
    color: "#ffffff",
  },
  paymentDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "8px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f1f5f9",
    marginBottom: "12px",
    "@media (min-width: 480px)": {
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
    },
  },
  // Pin label-above-value explicitly with flex column. The previous markup
  // relied on DOM order alone; something in the bidi/RTL context was rendering
  // the value above the label visually. Flex with explicit order guarantees
  // the visual order regardless of how the surrounding container behaves.
  paymentDetailCell: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  paymentDetailLabel: {
    fontSize: "12px !important",
    color: "#64748b",
    marginBottom: "2px !important",
    order: 1,
  },
  paymentDetailValue: {
    fontSize: "16px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    direction: "ltr",
    textAlign: "right",
    order: 2,
  },
  paymentDisclaimer: {
    fontSize: "12px !important",
    color: "#64748b",
    lineHeight: "1.7 !important",
    "& + &": { marginTop: "2px !important" },
  },

  // ─── 4. TERMS (all expanded, no accordion) ────────────────────────────────

  termsList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  termsSection: {
    background: "#fafafa",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "14px 16px",
  },
  termsSectionTitle: {
    fontSize: "13px !important",
    fontWeight: "700 !important",
    color: "#0d9488",
    marginBottom: "8px !important",
    paddingBottom: "6px",
    borderBottom: "1px solid #ccfbf1",
  },
  termsSectionBody: {
    fontSize: "12.5px !important",
    color: "#334155",
    lineHeight: "1.75 !important",
    whiteSpace: "pre-line",
  },

  // ─── 5. SIGNATURE (large, full-width, prominent) ──────────────────────────

  signatureSection: {
    background: "#ffffff",
    border: "2px solid #0d9488",
    borderRadius: "12px",
    padding: "16px 18px 12px",
  },
  signatureLabel: {
    fontSize: "13px !important",
    fontWeight: "700 !important",
    color: "#0d9488",
    marginBottom: "10px !important",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  canvasWrapper: {
    position: "relative",
    border: "1px dashed #cbd5e1",
    borderRadius: "10px",
    overflow: "hidden",
    background: "#fbfbfb",
    cursor: "crosshair",
  },
  canvas: {
    display: "block",
    width: "100%",
    height: "220px",
    touchAction: "none",
    "@media (min-width: 700px)": {
      height: "260px",
    },
  },
  canvasHint: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    color: "#cbd5e1",
    fontSize: "16px",
    pointerEvents: "none",
    userSelect: "none",
  },
  clearRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "8px",
  },
  clearButton: {
    color: "#64748b !important",
    fontSize: "12px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    padding: "4px 12px !important",
    border: "1px solid #e2e8f0 !important",
    borderRadius: "6px !important",
    "&:hover": { background: "#f1f5f9 !important" },
  },

  // ─── 6. SUBMIT ────────────────────────────────────────────────────────────

  consentText: {
    fontSize: "12px !important",
    color: "#64748b",
    lineHeight: "1.65 !important",
    margin: "18px 0 12px !important",
    textAlign: "center",
  },
  submitButton: {
    width: "100%",
    padding: "16px !important",
    color: "#ffffff !important",
    fontSize: "16px !important",
    fontWeight: "700 !important",
    textTransform: "none !important",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "12px !important",
    boxShadow: "0 6px 20px rgba(13, 148, 136, 0.30) !important",
    "&:hover": {
      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important",
    },
    "&:disabled": {
      background: "#e2e8f0 !important",
      color: "#94a3b8 !important",
      boxShadow: "none !important",
    },
  },
  submitError: {
    color: "#dc2626",
    fontSize: "13px !important",
    textAlign: "center",
    marginTop: "10px !important",
  },

  // ─── success ──────────────────────────────────────────────────────────────

  successBlock: {
    textAlign: "center",
    padding: "30px 8px 12px",
  },
  successIcon: {
    fontSize: "72px !important",
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
    color: "#475569",
    lineHeight: "1.65 !important",
  },
}));
