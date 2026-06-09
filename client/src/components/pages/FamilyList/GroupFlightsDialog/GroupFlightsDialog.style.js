import { makeStyles } from "@mui/styles";

// Group-flights modal: optional "apply head to all" banner, shared leg inputs
// (with copy-from), then the per-person list (toggle + direction). Teal accent +
// chrome consistent with the other FamilyList dialogs.
export const useStyles = makeStyles(() => ({
  paper: {
    direction: "rtl",
    borderRadius: "16px !important",
    width: "760px",
    maxWidth: "95vw",
  },
  title: {
    fontSize: "18px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    padding: "20px 24px 2px !important",
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    // !important: this @mui/styles (JSS) class is otherwise overridden by MUI v5's
    // emotion `.MuiTypography-root { margin: 0 }`, which collapsed the inset and
    // jammed the text against the (RTL) right edge.
    margin: "2px 24px 10px 24px !important",
    lineHeight: 1.5,
  },
  content: {
    padding: "8px 24px 4px !important",
    overflow: "hidden",
  },

  // ── Shared leg inputs ───────────────────────────────────────────────────────
  legsCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "14px 16px",
    background: "#f8fafc",
    marginBottom: "16px",
  },
  legsCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
  },
  legsCardTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#334155",
  },
  copyFromSelect: {
    minWidth: "190px",
    "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "13px", background: "#ffffff" },
    // !important: beat MUI v5's emotion input styles, which otherwise override
    // the JSS fontSize on the closed value.
    "& .MuiSelect-select": { fontSize: "13px !important" },
    "& .MuiOutlinedInput-input": { padding: "7px 12px" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
  },
  legGroup: {
    marginBottom: "12px",
    "&:last-child": { marginBottom: 0 },
  },
  legHeader: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "8px",
  },
  legTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#0f766e",
  },
  legFields: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "10px",
  },
  fieldItem: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  fieldLabel: {
    fontSize: "11.5px !important",
    fontWeight: "600 !important",
    color: "#64748b !important",
  },
  field: {
    "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "13.5px", background: "#ffffff" },
    "& .MuiOutlinedInput-input": { padding: "9px 12px" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0d9488" },
  },

  // ── People list ─────────────────────────────────────────────────────────────
  listHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "2px 2px 6px",
  },
  listTitle: {
    fontSize: "13px",
    fontWeight: 700,
    color: "#334155",
  },
  // Read-only badge showing which scope the modal was opened with (chosen at entry).
  scopeBadge: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#0d9488",
    background: "#f0fdfa",
    border: "1px solid #99f6e4",
    borderRadius: "999px",
    padding: "2px 12px",
  },
  peopleScroll: {
    maxHeight: "42vh",
    overflowY: "auto",
    border: "1px solid #f1f5f9",
    borderRadius: "10px",
    "&::-webkit-scrollbar": { width: "8px" },
    "&::-webkit-scrollbar-thumb": { background: "#e2e8f0", borderRadius: "4px" },
  },
  // Each person = a two-line block: top line (flying + direction), then the
  // per-person passport line. The card owns the divider + hover.
  personCard: {
    padding: "8px 12px",
    borderBottom: "1px solid #f1f5f9",
    "&:last-child": { borderBottom: "none" },
    "&:hover": { background: "#f8fafc" },
  },
  personRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  // Shown under a locked person (already has flight data) instead of the passport
  // line — their changes are made individually on their own page.
  lockedNote: {
    fontSize: "12px",
    color: "#b45309",
    marginTop: "5px",
    paddingRight: "42px", // align under the name (past the switch)
  },
  passportLine: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginTop: "6px",
    paddingRight: "42px", // align under the name (past the switch)
  },
  passportLabel: {
    fontSize: "11.5px",
    fontWeight: 600,
    color: "#94a3b8",
    minWidth: "38px",
  },
  passportField: {
    flex: 1,
    maxWidth: "240px",
    "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "13px", background: "#ffffff" },
    "& .MuiOutlinedInput-input": { padding: "7px 12px" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0d9488" },
  },
  personName: {
    fontSize: "13.5px",
    color: "#0f172a",
    flex: 1,
  },
  personMeta: {
    fontSize: "11.5px",
    color: "#94a3b8",
  },
  hasFlightsTag: {
    fontSize: "11px",
    color: "#0d9488",
    fontWeight: 600,
    background: "#f0fdfa",
    border: "1px solid #99f6e4",
    borderRadius: "999px",
    padding: "1px 8px",
  },
  directionSelect: {
    minWidth: "130px",
    "& .MuiOutlinedInput-root": { borderRadius: "8px", fontSize: "13px", background: "#ffffff" },
    // !important: beat MUI v5's emotion input styles, which otherwise override
    // the JSS fontSize on the closed value.
    "& .MuiSelect-select": { fontSize: "13px !important" },
    "& .MuiOutlinedInput-input": { padding: "6px 10px" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
  },
  directionPlaceholder: {
    minWidth: "130px",
    fontSize: "12px",
    color: "#cbd5e1",
    textAlign: "center",
  },
  emptyPeople: {
    padding: "20px",
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "13px",
  },

  actions: {
    padding: "14px 24px 20px !important",
    gap: "8px",
    borderTop: "1px solid #f1f5f9",
  },
  submitBtn: {
    background: "#0d9488 !important",
    color: "#ffffff !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    borderRadius: "8px !important",
    padding: "7px 28px !important",
    "&:hover": { background: "#0f766e !important" },
    "&.Mui-disabled": { background: "#94d3cc !important", color: "#ffffff !important" },
  },
  cancelBtn: {
    color: "#64748b !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    borderRadius: "8px !important",
    padding: "7px 18px !important",
  },
}));
