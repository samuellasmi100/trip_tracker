import { makeStyles } from "@mui/styles";

// Document-portal-specific styles. The page chrome (page / card / hero / verify
// gate / footer) is REUSED from the registration shell's style module so the
// two public pages look identical; only the upload-grid pieces live here.
export const useStyles = makeStyles(() => ({
  // Intro line under the hero.
  intro: {
    fontSize: "14px !important",
    color: "#475569",
    textAlign: "center",
    lineHeight: "1.6 !important",
    marginBottom: "20px !important",
  },

  // Overall progress (X/Y) bar.
  progressWrap: {
    marginBottom: "22px",
  },
  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    color: "#334155",
    marginBottom: "6px !important",
  },

  // ── Split mode: "links to forward" panel ──────────────────────────────────
  // Shown above the upload grid when the head opened a ?split=1 link for a
  // multi-surname family. Visually distinct (teal card) from the upload area so
  // "forward to others" reads differently from "upload my own files".
  forwardPanel: {
    border: "1px solid #ccfbf1",
    background: "#f0fdfa",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "22px",
  },
  forwardTitle: {
    fontSize: "15px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "4px !important",
  },
  forwardHint: {
    fontSize: "12.5px !important",
    color: "#475569",
    lineHeight: "1.55 !important",
    marginBottom: "12px !important",
  },
  forwardList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  forwardRow: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "10px 12px",
  },
  forwardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
  },
  forwardName: {
    fontSize: "14px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
  },
  forwardCount: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#0d9488",
    background: "#f0fdfa",
    border: "1px solid #ccfbf1",
    borderRadius: "999px",
    padding: "2px 10px",
  },
  forwardActions: {
    display: "flex",
    gap: "8px",
  },
  forwardBtn: {
    flex: 1,
    padding: "8px !important",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    borderRadius: "10px !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  forwardWhatsapp: {
    background: "#25d366 !important",
    color: "#ffffff !important",
    "&:hover": { background: "#128c7e !important" },
  },
  forwardCopy: {
    background: "#ffffff !important",
    color: "#0f172a !important",
    border: "1.5px solid #0d9488 !important",
    "&:hover": { background: "#f0fdfa !important" },
  },
  // Header row above the upload grid (split mode): "my docs / all family" title
  // plus the show-all toggle. Wraps to two lines on narrow phones.
  uploadBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "10px",
  },
  // Heading that introduces the upload area below the forward panel.
  uploadHeading: {
    fontSize: "15px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
  },
  showAllToggle: {
    margin: "0 !important",
    "& .MuiFormControlLabel-label": {
      fontSize: "13px !important",
      color: "#475569",
      fontWeight: "600 !important",
    },
  },

  // Responsive guest grid: one column on phones, auto-filling columns that use
  // the full desktop width.
  guestGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "16px",
    "@media (min-width: 700px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    },
  },

  guestCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    background: "#ffffff",
    padding: "16px",
    boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
  },
  guestHeader: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    borderBottom: "1px solid #f1f5f9",
    paddingBottom: "10px",
    marginBottom: "12px",
  },
  guestIcon: {
    fontSize: "20px !important",
    color: "#0d9488",
  },
  guestName: {
    fontSize: "15px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    flex: 1,
    minWidth: 0,
    // Wrap the full "first last" name instead of ellipsis-truncating it — long
    // or compound names (common in multi-surname families) must stay fully
    // readable so guests sharing a first name are distinguishable.
    overflowWrap: "anywhere",
  },
  guestCount: {
    fontSize: "12px",
    fontWeight: 600,
    color: "#64748b",
    background: "#f1f5f9",
    padding: "2px 9px",
    borderRadius: "999px",
    flexShrink: 0,
  },

  slotList: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  slot: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
    padding: "10px 12px",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    background: "#f8fafc",
  },
  slotDone: {
    borderColor: "#bbf7d0",
    background: "#f0fdf4",
  },
  // Picked but not yet saved (pending the "שמור" batch).
  slotStaged: {
    borderColor: "#fde68a",
    background: "#fffbeb",
  },
  slotIconStaged: {
    fontSize: "22px !important",
    color: "#f59e0b",
    flexShrink: 0,
  },
  slotPending: {
    fontSize: "12px !important",
    color: "#b45309",
    fontWeight: "600 !important",
  },
  slotMain: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: 0,
  },
  slotIconDone: {
    fontSize: "22px !important",
    color: "#22c55e",
    flexShrink: 0,
  },
  slotIconMissing: {
    fontSize: "22px !important",
    color: "#cbd5e1",
    flexShrink: 0,
  },
  slotText: {
    minWidth: 0,
  },
  slotLabel: {
    fontSize: "14px !important",
    fontWeight: "600 !important",
    color: "#1e293b",
  },
  slotFile: {
    fontSize: "12px !important",
    color: "#64748b",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "180px",
  },
  slotHint: {
    fontSize: "12px !important",
    color: "#94a3b8",
  },
  slotErr: {
    fontSize: "12px !important",
    color: "#dc2626",
  },
  slotActions: {
    display: "flex",
    alignItems: "center",
    gap: "2px",
    flexShrink: 0,
  },
  uploadBtn: {
    color: "#ffffff !important",
    fontSize: "13px !important",
    fontWeight: "700 !important",
    textTransform: "none !important",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "10px !important",
    padding: "6px 14px !important",
    boxShadow: "0 2px 8px rgba(13,148,136,0.25) !important",
    "&:hover": {
      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important",
    },
  },
  actionBtn: {
    color: "#0d9488 !important",
  },
  deleteBtn: {
    color: "#ef4444 !important",
  },

  // Final all-done banner.
  successBlock: {
    textAlign: "center",
    padding: "12px 8px 4px",
    marginBottom: "8px",
  },
  successIcon: {
    fontSize: "44px !important",
    color: "#22c55e",
    marginBottom: "6px !important",
  },
  successText: {
    fontSize: "14px !important",
    color: "#15803d",
    fontWeight: "600 !important",
  },

  // Sticky save bar — the single "שמור" commit for the staged batch.
  saveBar: {
    position: "sticky",
    bottom: 0,
    marginTop: "20px",
    paddingTop: "16px",
    background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, #ffffff 28%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "8px",
  },
  saveButton: {
    width: "100%",
    padding: "13px !important",
    color: "#ffffff !important",
    fontSize: "15px !important",
    fontWeight: "700 !important",
    textTransform: "none !important",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "12px !important",
    boxShadow: "0 4px 14px rgba(13, 148, 136, 0.30) !important",
    "&:hover": {
      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important",
    },
    "&:disabled": {
      background: "#e2e8f0 !important",
      color: "#94a3b8 !important",
      boxShadow: "none !important",
    },
  },
  saveMsgOk: {
    fontSize: "13px !important",
    color: "#15803d",
    fontWeight: "600 !important",
    textAlign: "center",
  },
  saveMsgErr: {
    fontSize: "13px !important",
    color: "#dc2626",
    fontWeight: "600 !important",
    textAlign: "center",
  },
}));
