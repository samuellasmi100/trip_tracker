import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  container: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    direction: "rtl",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px 12px",
    borderBottom: "1px solid #e2e8f0",
  },
  title: {
    fontSize: "18px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
  },
  tableWrap: {
    flex: 1,
    overflow: "auto",
  },
  headerCell: {
    fontWeight: "700 !important",
    fontSize: "13px !important",
    color: "#475569",
    backgroundColor: "#f8fafc !important",
    borderBottom: "2px solid #e2e8f0 !important",
    padding: "10px 14px !important",
    whiteSpace: "nowrap",
  },
  dataCell: {
    fontSize: "13px !important",
    color: "#334155",
    padding: "10px 14px !important",
    borderBottom: "1px solid #f1f5f9 !important",
  },
  familyName: {
    fontWeight: "600 !important",
  },
  progressWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "160px",
  },
  progressText: {
    fontSize: "12px",
    color: "#64748b",
    whiteSpace: "nowrap",
  },
  chipComplete: {
    backgroundColor: "#dcfce7 !important",
    color: "#15803d !important",
    fontWeight: "700 !important",
    fontSize: "11px !important",
  },
  chipPartial: {
    backgroundColor: "#fef3c7 !important",
    color: "#b45309 !important",
    fontWeight: "700 !important",
    fontSize: "11px !important",
  },
  chipMissing: {
    backgroundColor: "#fee2e2 !important",
    color: "#b91c1c !important",
    fontWeight: "700 !important",
    fontSize: "11px !important",
  },
  actionBtn: {
    color: "#64748b !important",
    "&:hover": { color: "#0d9488 !important" },
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#94a3b8",
    fontSize: "14px",
  },
  // Detail panel (Drawer)
  drawerPaper: {
    width: "360px !important",
    direction: "rtl",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 20px",
    borderBottom: "1px solid #e2e8f0",
    background: "linear-gradient(135deg, #f0fdfa, #e6fffa)",
  },
  drawerTitle: {
    fontSize: "16px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
  },
  drawerBody: {
    padding: "16px 20px",
    overflowY: "auto",
  },
  docItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #f1f5f9",
  },
  docItemInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  docItemLabel: {
    fontSize: "13px !important",
    fontWeight: "600 !important",
    color: "#334155",
  },
  docItemMeta: {
    fontSize: "11px !important",
    color: "#94a3b8",
  },
  sectionHeading: {
    fontSize: "13px !important",
    fontWeight: "700 !important",
    color: "#64748b",
    marginTop: "16px !important",
    marginBottom: "6px !important",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  copySuccessText: {
    fontSize: "12px",
    color: "#15803d",
    marginRight: "8px",
  },
}));
