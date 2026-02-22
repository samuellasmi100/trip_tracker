import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  /* ── Search field ───────────────────────────────────────────────────────── */
  textField: {
    borderRadius: 10,
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 13,
      width: "140px",
      padding: "6px 12px",
      height: "20px",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#0d9488" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },

  /* ── Table ──────────────────────────────────────────────────────────────── */
  dataTableBody: {
    "& tr:nth-of-type(odd)": { backgroundColor: "#f8fafc" },
    "& tr:nth-of-type(even)": { backgroundColor: "#ffffff" },
  },
  clickableRow: {
    cursor: "pointer !important",
    transition: "background-color 120ms ease",
    "&:hover": { backgroundColor: "#f0fdfa !important" },
  },
  headerTableRow: {
    fontSize: "12px !important",
    color: "#64748b !important",
    textAlign: "center !important",
    borderBottom: "1px solid #e2e8f0 !important",
    fontWeight: "600 !important",
    whiteSpace: "nowrap",
    padding: "8px !important",
    "&.MuiTableCell-stickyHeader": { backgroundColor: "#ffffff !important" },
  },
  dataTableCell: {
    fontSize: "12px !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    borderBottom: "none !important",
    whiteSpace: "nowrap",
    padding: "6px 8px !important",
  },
  familyNameCell: {
    fontSize: "13px !important",
    color: "#0f766e !important",
    fontWeight: "600 !important",
    textAlign: "center !important",
    borderBottom: "none !important",
    padding: "6px 8px !important",
    whiteSpace: "nowrap",
  },

  /* ── Status badges ──────────────────────────────────────────────────────── */
  statusBadge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "10px",
    fontSize: "11px",
    fontWeight: 600,
  },
  paymentNoneText: {
    color: "#94a3b8",
    fontStyle: "italic",
    fontSize: "11px",
  },
  paymentUnpaid: {
    backgroundColor: "#fef2f2",
    color: "#ef4444",
  },
  paymentPartial: {
    backgroundColor: "#fffbeb",
    color: "#d97706",
  },
  paymentPaid: {
    backgroundColor: "#f0fdf4",
    color: "#16a34a",
  },
}));
