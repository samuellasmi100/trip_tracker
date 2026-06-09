import { makeStyles } from "@mui/styles";

// Shared column template for the header rows and each data row so the labels
// stay aligned over their inputs. RTL: col 1 (rightmost) is the row number,
// the last col (leftmost) is the delete button. Columns:
//   #  |  he-first  he-last  en-first  en-last  |  classification  birth_date  age  |  delete
// Plain fr units: the columns always divide the available width and NEVER
// overflow — so the wide dialog has no horizontal scrollbar. (Earlier minmax
// floors summed wider than the dialog and forced a spurious scrollbar.)
const GRID = "32px 1fr 1fr 1fr 1fr 1.2fr 1fr 64px 40px";

// Lightweight repeatable-rows dialog for bulk-adding people by name only.
// Chrome mirrors the teal accent used across the FamilyList dialogs.
export const useStyles = makeStyles(() => ({
  paper: {
    direction: "rtl",
    borderRadius: "16px !important",
    // Roomy fixed width (NOT full-screen); shrinks on smaller screens via the vw
    // cap. !important beats MUI's default paperWidthSm (~600px) cap.
    width: "1150px",
    maxWidth: "92vw !important",
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
    // RTL: text starts at the right, so give it extra right inset so it doesn't
    // hug the edge (the bold title reads as more inset at the same 24px).
    margin: "0 30px 8px 24px",
    lineHeight: 1.5,
  },
  content: {
    padding: "8px 24px 4px !important",
    overflow: "hidden",
  },

  // Header + rows share this container (grid siblings, same template → aligned).
  // VERTICAL scroll only, and only when there are many rows. Horizontal is
  // hidden: fr columns always fit the width, so there's nothing to scroll and no
  // spurious scrollbar.
  tableScroll: {
    overflowX: "hidden",
    overflowY: "auto",
    maxHeight: "56vh",
    "&::-webkit-scrollbar": { width: "8px" },
    "&::-webkit-scrollbar-thumb": { background: "#e2e8f0", borderRadius: "4px" },
    "&::-webkit-scrollbar-thumb:hover": { background: "#cbd5e1" },
  },

  // ── Two-tier header: language group spanning its two fields, then short
  //    first/last sub-labels under each. ──────────────────────────────────────
  groupHead: {
    display: "grid",
    gridTemplateColumns: GRID,
    columnGap: "16px",
    padding: "0 2px",
  },
  groupLabel: {
    gridColumn: "span 2",
    textAlign: "center",
    fontSize: "12.5px",
    fontWeight: 700,
    color: "#0f766e",
    paddingBottom: "6px",
    borderBottom: "2px solid #99f6e4",
  },
  subHead: {
    display: "grid",
    gridTemplateColumns: GRID,
    columnGap: "16px",
    padding: "8px 2px 2px",
  },
  subHeadIndex: {
    textAlign: "center",
    fontSize: "11px",
    fontWeight: 600,
    color: "#94a3b8",
  },
  subHeadLabel: {
    fontSize: "11.5px",
    fontWeight: 600,
    color: "#64748b",
    paddingRight: "4px",
  },

  row: {
    display: "grid",
    gridTemplateColumns: GRID,
    columnGap: "16px",
    alignItems: "center",
    padding: "7px 2px",
    borderRadius: "8px",
    "&:hover": { background: "#f8fafc" },
  },
  rowIndex: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#64748b",
    textAlign: "center",
  },
  field: {
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      fontSize: "13.5px",
      background: "#ffffff",
    },
    "& .MuiOutlinedInput-input": { padding: "9px 12px" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0d9488" },
  },
  // Classification Select — matches the text fields' compact look. !important on
  // .MuiSelect-select beats MUI v5's emotion input styles (same fix as the other
  // dialogs' selects).
  classSelect: {
    borderRadius: "8px !important",
    background: "#ffffff",
    fontSize: "13px",
    "& .MuiSelect-select": { fontSize: "13px !important", padding: "9px 12px" },
    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e2e8f0" },
    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cbd5e1" },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#0d9488" },
  },
  removeBtn: {
    color: "#ef4444 !important",
    "&.Mui-disabled": { color: "#e2e8f0 !important" },
  },

  // Remaining-capacity hint appended to the subtitle.
  capacityNote: {
    color: "#0d9488",
    fontWeight: 600,
  },
  addRowWrap: {
    padding: "10px 2px 4px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  capacityFull: {
    fontSize: "12px",
    color: "#b45309",
    fontWeight: 600,
  },
  addRowBtn: {
    color: "#0d9488 !important",
    textTransform: "none !important",
    fontWeight: "600 !important",
    fontSize: "13px !important",
    borderRadius: "8px !important",
    padding: "5px 12px !important",
    "&:hover": { background: "#f0fdfa !important" },
    // RTL: the startIcon sits to the right of the label; MUI's LTR-oriented
    // default margins crowd it against the text, so set explicit breathing room.
    "& .MuiButton-startIcon": { marginLeft: "8px", marginRight: "-2px" },
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
