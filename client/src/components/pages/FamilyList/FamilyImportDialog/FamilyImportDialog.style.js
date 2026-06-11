import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  dialogPaper: {
    borderRadius: "14px !important",
    minWidth: "460px !important",
    maxWidth: "560px !important",
    direction: "rtl",
  },
  title: {
    fontSize: "16px !important",
    fontWeight: "700 !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    padding: "18px 24px 6px !important",
  },
  content: {
    padding: "8px 24px 16px !important",
  },
  // Centered loading block while the import runs.
  loadingWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
    padding: "32px 0",
  },
  loadingText: {
    fontSize: "13px !important",
    color: "#64748b !important",
  },
  // Headline summary (imported N of M).
  summary: {
    textAlign: "center",
    background: "#f0fdfa",
    border: "1px solid #99f6e4",
    borderRadius: "10px",
    padding: "12px",
    marginBottom: "14px",
  },
  summaryBig: {
    fontSize: "26px",
    fontWeight: 800,
    color: "#0f766e",
    lineHeight: 1.1,
  },
  summarySub: {
    fontSize: "12px",
    color: "#475569",
    marginTop: "2px",
  },
  errorBox: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "12px",
    color: "#b91c1c",
    fontSize: "13px",
    textAlign: "center",
  },
  // One report section (e.g. "skipped duplicates").
  section: {
    border: "1px solid #e2e8f0",
    borderRadius: "10px",
    marginBottom: "8px",
    overflow: "hidden",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "9px 12px",
    cursor: "pointer",
    userSelect: "none",
  },
  sectionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#334155",
  },
  countChip: {
    minWidth: "22px",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: 700,
    borderRadius: "10px",
    padding: "1px 8px",
  },
  sectionBody: {
    padding: "4px 12px 10px",
    maxHeight: "180px",
    overflowY: "auto",
    borderTop: "1px solid #f1f5f9",
  },
  itemRow: {
    fontSize: "12px",
    color: "#475569",
    padding: "3px 0",
    borderBottom: "1px dashed #f1f5f9",
  },
  actions: {
    justifyContent: "center !important",
    padding: "8px 24px 18px !important",
  },
  closeBtn: {
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    color: "#ffffff !important",
    borderRadius: "8px !important",
    fontSize: "13px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "8px 32px !important",
  },
}));
