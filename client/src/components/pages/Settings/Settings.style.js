import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  /* ── Root layout ─────────────────────────────────────────────────────────── */
  root: {
    display: "flex",
    flexDirection: "row",
    direction: "rtl",
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#ffffff",
  },

  /* ── Sidebar nav ─────────────────────────────────────────────────────────── */
  sidebar: {
    width: "210px",
    flexShrink: 0,
    backgroundColor: "#f8fafc",
    borderLeft: "1px solid #e8edf2",
    paddingTop: "32px",
    paddingBottom: "32px",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    padding: "0 20px 20px",
    borderBottom: "1px solid #e8edf2",
    marginBottom: "8px",
  },
  sidebarTitle: {
    fontSize: "16px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    letterSpacing: "-0.01em",
  },
  sidebarSubtitle: {
    fontSize: "12px !important",
    color: "#94a3b8",
    marginTop: "2px !important",
  },
  navList: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
    padding: "8px 10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "9px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    userSelect: "none",
    border: "1px solid transparent",
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },
  },
  navItemActive: {
    backgroundColor: "#f0fdfa !important",
    border: "1px solid #ccfbf1 !important",
    "& $navLabel": {
      color: "#0d9488 !important",
      fontWeight: "700 !important",
    },
    "& $navIcon": {
      color: "#0d9488 !important",
    },
  },
  navIcon: {
    fontSize: "18px !important",
    color: "#94a3b8",
    flexShrink: 0,
  },
  navLabel: {
    fontSize: "13px !important",
    fontWeight: "500 !important",
    color: "#475569",
    lineHeight: "1 !important",
  },

  /* ── Content panel ───────────────────────────────────────────────────────── */
  content: {
    flex: 1,
    padding: "40px 48px",
    overflowY: "auto",
    maxWidth: "640px",
  },

  /* ── Tab section header ──────────────────────────────────────────────────── */
  tabHeader: {
    display: "flex",
    alignItems: "flex-start",
    gap: "14px",
    marginBottom: "28px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f1f5f9",
  },
  tabIconWrap: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
    border: "1px solid #99f6e4",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tabHeaderIcon: {
    fontSize: "20px !important",
    color: "#0d9488",
  },
  tabHeaderText: {
    flex: 1,
  },
  tabTitle: {
    fontSize: "16px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    marginBottom: "3px !important",
  },
  tabDesc: {
    fontSize: "13px !important",
    color: "#64748b",
    lineHeight: "1.5 !important",
  },

  /* ── Field group ─────────────────────────────────────────────────────────── */
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  fieldLabel: {
    fontSize: "12px !important",
    fontWeight: "600 !important",
    color: "#374151",
    marginBottom: "5px !important",
    display: "block",
  },
  fieldLabelRequired: {
    "&::after": {
      content: '" *"',
      color: "#ef4444",
    },
  },

  /* ── Input styles ────────────────────────────────────────────────────────── */
  input: {
    "& .MuiInputBase-input": {
      fontSize: 13,
      color: "#1e293b",
      padding: "9px 12px",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&:hover fieldset": { borderColor: "#94a3b8" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488", borderWidth: "1.5px" },
    },
  },
  urlRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  urlField: {
    flex: 1,
    "& .MuiInputBase-input": {
      fontSize: 13,
      color: "#1e293b",
      padding: "8px 12px",
      direction: "ltr",
      textAlign: "left",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      "& fieldset": { borderColor: "#e2e8f0" },
    },
  },

  /* ── Buttons ─────────────────────────────────────────────────────────────── */
  btnPrimary: {
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    color: "#ffffff !important",
    borderRadius: "8px !important",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "8px 22px !important",
    boxShadow: "0 2px 6px rgba(13,148,136,0.25) !important",
    "&:hover": { boxShadow: "0 3px 10px rgba(13,148,136,0.35) !important" },
    "&.Mui-disabled": { background: "#e2e8f0 !important", color: "#94a3b8 !important", boxShadow: "none !important" },
  },
  btnSuccess: {
    background: "linear-gradient(135deg, #16a34a 0%, #22c55e 100%) !important",
    color: "#ffffff !important",
    borderRadius: "8px !important",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "8px 22px !important",
  },
  btnOutline: {
    color: "#0d9488 !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "7px 16px !important",
    border: "1px solid #0d9488 !important",
    whiteSpace: "nowrap",
    "&:hover": { background: "#f0fdfa !important" },
  },
  btnGhost: {
    color: "#64748b !important",
    borderRadius: "8px !important",
    fontSize: "12px !important",
    fontWeight: "500 !important",
    textTransform: "none !important",
    padding: "7px 14px !important",
    border: "1px solid #e2e8f0 !important",
    whiteSpace: "nowrap",
    "&:hover": { background: "#f1f5f9 !important" },
  },

  /* ── URL display chip ────────────────────────────────────────────────────── */
  urlChip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    padding: "10px 14px",
    marginBottom: "12px",
  },
  urlChipText: {
    flex: 1,
    fontSize: "12px !important",
    color: "#0d9488",
    fontFamily: "monospace",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    direction: "ltr",
    textAlign: "left",
  },

  /* ── Doc types list ──────────────────────────────────────────────────────── */
  docTypeItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #f1f5f9",
    backgroundColor: "#ffffff",
    marginBottom: "6px",
    "&:hover": {
      borderColor: "#e2e8f0",
      backgroundColor: "#fafbfc",
    },
  },
  docTypeLabel: {
    fontSize: "13px !important",
    color: "#1e293b",
    fontWeight: "500 !important",
  },

  /* ── Toggle row ──────────────────────────────────────────────────────────── */
  toggleRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
  },
  toggleLabel: {
    fontSize: "13px !important",
    fontWeight: "600 !important",
    color: "#1e293b",
  },
  toggleHint: {
    fontSize: "11px !important",
    color: "#94a3b8",
    marginTop: "2px !important",
  },

  /* ── Test mode badge ─────────────────────────────────────────────────────── */
  testBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "#fef3c7",
    color: "#92400e",
    border: "1px solid #fde68a",
    borderRadius: "6px",
    padding: "3px 8px",
    fontSize: "11px",
    fontWeight: 600,
    marginBottom: "12px",
  },

  /* ── Empty state ─────────────────────────────────────────────────────────── */
  emptyState: {
    textAlign: "center",
    padding: "32px 0",
    color: "#94a3b8",
    fontSize: "13px !important",
    fontStyle: "italic",
  },

  /* ── Hint text ───────────────────────────────────────────────────────────── */
  hint: {
    fontSize: "12px !important",
    color: "#94a3b8",
  },
}));
