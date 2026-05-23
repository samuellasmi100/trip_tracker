import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  drawerPaper: {
    width: "400px",
    maxWidth: "90vw",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    padding: "16px 20px 14px",
    borderBottom: "1px solid #e2e8f0",
    background: "linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "8px",
  },
  headerInfo: { flex: 1, minWidth: 0 },
  name: {
    fontSize: "16px !important",
    fontWeight: "700 !important",
    color: "#0f172a !important",
    marginBottom: "4px !important",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  phoneRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#0d9488",
    textDecoration: "none",
    marginBottom: "6px",
    "&:hover": { textDecoration: "underline" },
  },
  lastUpdated: {
    fontSize: "11px !important",
    color: "#94a3b8 !important",
    marginTop: "6px !important",
  },
  body: {
    flex: 1,
    overflowY: "auto",
    padding: "16px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  section: {},
  sectionLabel: {
    fontSize: "11px !important",
    fontWeight: "600 !important",
    color: "#94a3b8 !important",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "8px !important",
  },
  statusPills: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },
  pill: {
    fontSize: "12px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    padding: "6px 10px !important",
    borderRadius: "8px !important",
    border: "1px solid #e2e8f0 !important",
    background: "#ffffff !important",
    color: "#475569 !important",
    "&:hover": { background: "#f1f5f9 !important" },
  },
  // Active status pill: solid fill in the app's teal (same as the primary
  // עריכה מלאה / הוסף buttons) + white text, so the current status is obvious
  // and on-theme. !important is required because the base .pill background/
  // colour are also !important (a plain inline style cannot override them).
  pillActive: {
    background: "#0d9488 !important",
    color: "#ffffff !important",
    border: "1px solid transparent !important",
    boxShadow: "0 1px 4px rgba(0,0,0,0.15) !important",
    "&:hover": { background: "#0d9488 !important" },
  },
  dateRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  dateField: {
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: 13,
      padding: "8px 12px",
      height: "20px",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      "& fieldset": { borderColor: "#e2e8f0" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  dateFieldOverdue: {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "#dc2626 !important" },
    },
    "& .MuiInputBase-input": { color: "#dc2626 !important", fontWeight: 600 },
  },
  dateLabel: {
    fontSize: "12px !important",
    color: "#64748b",
    marginBottom: "4px !important",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 16px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  detailKey: {
    fontSize: "11px !important",
    color: "#94a3b8 !important",
    fontWeight: "500 !important",
  },
  detailValue: {
    fontSize: "13px !important",
    color: "#1e293b !important",
    wordBreak: "break-word",
  },
  detailFull: {
    gridColumn: "1 / -1",
  },
  footer: {
    padding: "12px 20px",
    borderTop: "1px solid #e2e8f0",
    background: "#f8fafc",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "8px",
  },
}));
