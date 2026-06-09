import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  dataTableBody: {
    "& tr:nth-of-type(odd)": { backgroundColor: "#f8fafc" },
    "& tr:nth-of-type(even)": { backgroundColor: "#ffffff" },
    "& tr": { transition: "background-color 0.15s ease" },
    // No !important here: this default hover must NOT clobber the per-row
    // follow-up / highlight hover shades (overdueRow / dueTodayRow / newRow /
    // returningRow), whose own "&:hover" rules use !important and so win on
    // importance. Uncoloured rows still get this hover (declared after the
    // striping rules above, so it wins by source order).
    "& tr:hover": { backgroundColor: "#f0fdfa" },
  },
  dataTableCell: {
    fontSize: "12px !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    borderBottom: "none !important",
    whiteSpace: "nowrap",
    padding: "6px 8px !important",
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
      "&:hover fieldset": { borderColor: "#e2e8f0" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  addButton: {
    color: "#ffffff !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "5px 16px !important",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "8px !important",
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.20) !important",
    minWidth: "80px !important",
    "&:hover": {
      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important",
    },
  },
  importButton: {
    color: "#0d9488 !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "5px 14px !important",
    background: "#ffffff !important",
    border: "1px solid #0d9488 !important",
    borderRadius: "8px !important",
    "&:hover": { background: "#f0fdfa !important" },
    "&.Mui-disabled": { opacity: 0.6 },
  },
  // Follow-up state row colours — both clear and noticeable at a glance, and
  // distinct from each other and from the new/returning highlights below.
  overdueRow: {
    // Past follow-up date — attention-drawing coral red.
    backgroundColor: "#ffcdc4 !important",
    "&:hover": { backgroundColor: "#ffb8ab !important" },
  },
  dueTodayRow: {
    // Follow-up due today — warm amber, clearly distinct from the overdue coral.
    backgroundColor: "#ffe5a0 !important",
    "&:hover": { backgroundColor: "#ffd766 !important" },
  },
  // Public-lead highlights. returningRow is a distinct soft pink-red so a
  // returning lead never reads as an overdue follow-up row. Highlight wins over
  // the follow-up colours (precedence in Leads.view.jsx).
  newRow: {
    backgroundColor: "#f0fdf4 !important",
    "&:hover": { backgroundColor: "#dcfce7 !important" },
  },
  returningRow: {
    backgroundColor: "#fee2e2 !important",
    "&:hover": { backgroundColor: "#fecaca !important" },
  },
  statusBadge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
}));

// Status color config — mirrors wigs lead status design, adapted to vacation context.
// Unknown statuses fall back to the gray badge in Leads.view.jsx:47.
export const STATUS_CONFIG = {
  new_interest: { bg: "#eff6ff", color: "#2563eb", label: "חדש" },
  follow_up:    { bg: "#fff7ed", color: "#ea580c", label: "בתהליך" },
  registered:   { bg: "#d1fae5", color: "#059669", label: "נסגר" },
  not_relevant: { bg: "#f1f5f9", color: "#94a3b8", label: "לא רלוונטי" },
};
