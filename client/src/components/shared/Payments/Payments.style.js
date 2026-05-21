import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  /* ── Standalone Dialog ──────────────────────────────────────────────────── */
  dialogPaper: {
    borderRadius: "14px !important",
    minWidth: "680px !important",
    maxWidth: "820px !important",
    direction: "rtl",
  },
  dialogTitle: {
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%)",
    padding: "14px 20px 12px !important",
  },
  titleRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "8px",
  },
  familyName: {
    fontSize: "16px !important",
    fontWeight: "700 !important",
    color: "#ffffff !important",
    flex: 1,
  },
  summaryBadge: {
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "12px",
    fontSize: "12px !important",
    fontWeight: "700 !important",
    border: "1.5px solid rgba(255,255,255,0.5)",
    color: "#ffffff !important",
    backgroundColor: "rgba(255,255,255,0.2) !important",
    whiteSpace: "nowrap",
  },
  closeBtn: {
    backgroundColor: "rgba(255,255,255,0.2) !important",
    color: "#ffffff !important",
    "&:hover": { backgroundColor: "rgba(255,255,255,0.3) !important" },
  },
  progressBarWrap: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.25)",
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: "#ffffff",
    transition: "width 0.4s ease",
  },
  remainingText: {
    fontSize: "11px !important",
    color: "rgba(255,255,255,0.85) !important",
    marginTop: "2px !important",
  },
  dialogContent: {
    padding: "16px 20px !important",
    maxHeight: "60vh",
    overflowY: "auto",
  },
  dialogActions: {
    padding: "10px 20px 14px !important",
    justifyContent: "flex-end !important",
    borderTop: "1px solid #f1f5f9",
  },
  closeActionBtn: {
    backgroundColor: "#f1f5f9 !important",
    color: "#64748b !important",
    borderRadius: "8px !important",
    fontSize: "13px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    padding: "6px 20px !important",
    "&:hover": { backgroundColor: "#e2e8f0 !important" },
  },

  /* ── Embedded mode header ───────────────────────────────────────────────── */
  embeddedHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
    padding: "10px 4px 6px",
    borderBottom: "1px solid #f1f5f9",
  },
  embeddedFamilyName: {
    fontSize: "14px !important",
    fontWeight: "700 !important",
    color: "#0f766e !important",
    flex: 1,
  },

  /* ── History table ──────────────────────────────────────────────────────── */
  historyTable: {},
  historyHeader: {
    fontSize: "11px !important",
    color: "#64748b !important",
    fontWeight: "600 !important",
    textAlign: "center !important",
    padding: "6px !important",
    borderBottom: "2px solid #e2e8f0 !important",
    backgroundColor: "#fafbfc !important",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap",
  },
  historyRow: {
    "&:hover": { backgroundColor: "#f0fdfa !important" },
  },
  historyCell: {
    fontSize: "12px !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    padding: "6px 8px !important",
    borderBottom: "1px solid #f1f5f9 !important",
  },

  /* ── Status chips ───────────────────────────────────────────────────────── */
  statusChip: {
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: 600,
  },
  chipCompleted: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
  },
  chipPending: {
    backgroundColor: "#fffbeb",
    color: "#d97706",
  },
  chipCancelled: {
    backgroundColor: "#fef2f2",
    color: "#ef4444",
  },

  /* ── Action bar ─────────────────────────────────────────────────────────── */
  actionBar: {
    display: "flex",
    gap: "8px",
    marginBottom: "12px",
    flexWrap: "wrap",
  },
  actionBtn: {
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "5px 14px !important",
    whiteSpace: "nowrap",
  },
  actionBtnManual: {
    backgroundColor: "#f1f5f9 !important",
    color: "#475569 !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "5px 14px !important",
    whiteSpace: "nowrap",
    border: "1px solid #e2e8f0 !important",
    "&:hover": { backgroundColor: "#e2e8f0 !important" },
  },
  actionBtnLink: {
    color: "#0d9488 !important",
    border: "1px solid #0d9488 !important",
    "&:hover": { backgroundColor: "#f0fdfa !important" },
  },
  actionBtnCard: {
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    color: "#ffffff !important",
    border: "none !important",
    boxShadow: "0 2px 6px rgba(13,148,136,0.25) !important",
    "&:hover": { boxShadow: "0 3px 10px rgba(13,148,136,0.35) !important" },
    "&.Mui-disabled": { background: "#e2e8f0 !important", color: "#94a3b8 !important", boxShadow: "none !important" },
  },
  actionBtnSuccess: {
    background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%) !important",
    color: "#ffffff !important",
    border: "none !important",
  },

  /* ── Inline add-form section ─────────────────────────────────────────────── */
  addFormSection: {
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "14px 16px",
    marginBottom: "12px",
  },

  /* ── Card last four ─────────────────────────────────────────────────────── */
  cardLastFour: {
    fontFamily: "monospace",
    fontSize: "11px",
    color: "#475569",
    backgroundColor: "#f1f5f9",
    padding: "2px 6px",
    borderRadius: "4px",
    letterSpacing: "0.05em",
  },

  /* ── Add-payment form ───────────────────────────────────────────────────── */
  emptyText: {
    textAlign: "center !important",
    color: "#94a3b8 !important",
    fontSize: "13px !important",
    padding: "20px 0 !important",
    fontStyle: "italic",
  },
  addFormTitle: {
    fontSize: "13px !important",
    fontWeight: "600 !important",
    color: "#1e293b !important",
    marginBottom: "6px !important",
  },
  fieldLabel: {
    fontSize: "11px !important",
    fontWeight: "600 !important",
    color: "#64748b !important",
    marginBottom: "3px !important",
  },
  formField: {
    "& .MuiInputBase-input": {
      fontSize: 13,
      padding: "6px 10px",
      height: "20px",
      width: "90px",
      color: "#1e293b",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#0d9488" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  formFieldWide: {
    "& .MuiInputBase-input": {
      fontSize: 13,
      padding: "6px 10px",
      height: "20px",
      color: "#1e293b",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#0d9488" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  selectField: {
    height: "34px !important",
    width: "110px",
    fontSize: "13px !important",
    "&.MuiOutlinedInput-root": {
      color: "#1e293b !important",
      borderRadius: "8px",
      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#0d9488" },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0d9488" },
    },
    "& .MuiSvgIcon-root": { color: "#0d9488" },
  },
  addBtn: {
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    color: "#ffffff !important",
    borderRadius: "8px !important",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "7px 18px !important",
    boxShadow: "0 2px 8px rgba(13,148,136,0.25) !important",
    whiteSpace: "nowrap",
    "&:hover": { boxShadow: "0 4px 12px rgba(13,148,136,0.35) !important" },
    "&.Mui-disabled": { background: "#e2e8f0 !important", color: "#94a3b8 !important" },
  },

  /* ── Payment status colors (used by embedded header badge) ─────────────── */
  paymentUnpaid: {
    backgroundColor: "#fef2f2 !important",
    color: "#ef4444 !important",
  },
  paymentPartial: {
    backgroundColor: "#fffbeb !important",
    color: "#d97706 !important",
  },
  paymentPaid: {
    backgroundColor: "#f0fdf4 !important",
    color: "#16a34a !important",
  },
}));
