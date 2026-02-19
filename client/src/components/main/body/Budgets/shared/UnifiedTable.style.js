import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  tableContainer: {
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  headerCell: {
    fontSize: "13px !important",
    color: "#64748b !important",
    textAlign: "center !important",
    borderBottom: "2px solid #e2e8f0 !important",
    fontWeight: "600 !important",
    backgroundColor: "#ffffff !important",
    padding: "12px 8px !important",
    whiteSpace: "nowrap",
  },
  bodyRow: {
    transition: "background-color 0.15s ease",
    "&:nth-of-type(odd)": {
      backgroundColor: "#f8fafc",
    },
    "&:hover": {
      backgroundColor: "#f1f5f9 !important",
    },
  },
  bodyCell: {
    fontSize: "14px !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    borderBottom: "1px solid #f1f5f9 !important",
    padding: "10px 8px !important",
  },
  actionButton: {
    padding: "4px !important",
    "&:hover": {
      backgroundColor: "#f1f5f9 !important",
    },
  },
  incomeType: {
    color: "#16a34a !important",
    fontWeight: "600 !important",
    backgroundColor: "#f0fdf4",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "12px !important",
  },
  expenseType: {
    color: "#dc2626 !important",
    fontWeight: "600 !important",
    backgroundColor: "#fef2f2",
    padding: "2px 8px",
    borderRadius: "6px",
    fontSize: "12px !important",
  },
  emptyState: {
    textAlign: "center",
    padding: "40px !important",
    color: "#94a3b8 !important",
    fontSize: "15px !important",
  },
}));
