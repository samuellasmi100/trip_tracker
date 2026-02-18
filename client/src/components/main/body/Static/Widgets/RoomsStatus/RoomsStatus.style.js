import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    padding: "12px",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  },
  legend: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11px",
    color: "#475569",
    fontWeight: 500,
  },
  legendDot: {
    width: "14px",
    height: "14px",
    borderRadius: "3px",
  },
  tableWrap: {
    overflow: "visible",
  },
  table: {
    tableLayout: "fixed !important",
    borderCollapse: "separate !important",
    borderSpacing: "0 !important",
  },
  /* ---- header cells ---- */
  cornerHeader: {
    width: "70px !important",
    minWidth: "70px !important",
    backgroundColor: "#f8fafc !important",
    borderBottom: "2px solid #cbd5e1 !important",
    fontSize: "11px !important",
    fontWeight: "700 !important",
    color: "#334155 !important",
    textAlign: "center !important",
    padding: "6px 4px !important",
  },
  dateHeader: {
    width: "36px !important",
    minWidth: "36px !important",
    maxWidth: "36px !important",
    backgroundColor: "#f8fafc !important",
    borderBottom: "2px solid #cbd5e1 !important",
    borderLeft: "1px solid #e2e8f0 !important",
    padding: "4px 0 !important",
    textAlign: "center !important",
    lineHeight: "1.2 !important",
    verticalAlign: "bottom !important",
  },
  dateHeaderDay: {
    fontSize: "10px",
    fontWeight: 600,
    color: "#475569",
  },
  dateHeaderNum: {
    fontSize: "10px",
    color: "#94a3b8",
    marginTop: "1px",
  },
  weekendHeader: {
    backgroundColor: "#f1f5f9 !important",
  },
  /* ---- body cells ---- */
  roomCell: {
    width: "70px !important",
    minWidth: "70px !important",
    backgroundColor: "#ffffff !important",
    borderBottom: "1px solid #e2e8f0 !important",
    fontSize: "12px !important",
    fontWeight: "600 !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    padding: "0 6px !important",
    height: "26px !important",
  },
  dayCell: {
    width: "36px !important",
    minWidth: "36px !important",
    maxWidth: "36px !important",
    height: "26px !important",
    padding: "0 !important",
    borderBottom: "1px solid #f1f5f9 !important",
    borderLeft: "1px solid #f1f5f9 !important",
  },
  available: {
    backgroundColor: "#d1fae5 !important",
  },
  unavailable: {
    backgroundColor: "#fecaca !important",
  },
  weekendCol: {
    borderLeft: "1px solid #e2e8f0 !important",
  },
  dataTableBody: {
    "& tr:hover td": {
      opacity: 0.85,
    },
  },
}));
