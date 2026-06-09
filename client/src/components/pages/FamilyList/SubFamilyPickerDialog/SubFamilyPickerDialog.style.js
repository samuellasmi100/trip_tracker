import { makeStyles } from "@mui/styles";

// Small pre-step dialog: pick which sub-family (surname) the group-flights modal
// should open scoped to. Teal accent, consistent with the other FamilyList dialogs.
export const useStyles = makeStyles(() => ({
  paper: {
    direction: "rtl",
    borderRadius: "16px !important",
    width: "420px",
    maxWidth: "92vw",
  },
  title: {
    fontSize: "17px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    padding: "20px 24px 2px !important",
  },
  subtitle: {
    fontSize: "13px",
    color: "#64748b",
    margin: "0 24px 8px 24px",
    lineHeight: 1.5,
  },
  content: {
    padding: "8px 20px 20px !important",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  option: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    width: "100%",
    textAlign: "right",
    background: "#ffffff",
    border: "1.5px solid #e2e8f0",
    borderRadius: "10px",
    padding: "11px 14px",
    cursor: "pointer",
    font: "inherit",
    transition: "border-color .15s, background .15s",
    "&:hover": { borderColor: "#0d9488", background: "#f0fdfa" },
  },
  // Completed sub-family: visible but not selectable.
  optionDone: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
    width: "100%",
    textAlign: "right",
    background: "#f8fafc",
    border: "1.5px dashed #e2e8f0",
    borderRadius: "10px",
    padding: "11px 14px",
    cursor: "default",
    font: "inherit",
    color: "#94a3b8",
    "& span": { color: "#94a3b8 !important" }, // mute the label inside a done row
  },
  optionLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0f172a",
  },
  optionCount: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#0d9488",
    background: "#f0fdfa",
    border: "1px solid #99f6e4",
    borderRadius: "999px",
    padding: "1px 10px",
    flexShrink: 0,
  },
}));
