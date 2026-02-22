import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  wrapper: {
    padding: "12px",
    direction: "rtl",
  },

  /* ── Toolbar ──────────────────────────────────────────────────────────── */
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
    flexWrap: "wrap",
    gap: "8px",
  },
  legend: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
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

  /* Selection action bar (appears when rooms are checked) */
  selectionBar: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "4px 12px",
  },
  selectionCount: {
    fontSize: "13px",
    fontWeight: 600,
    color: "#1d4ed8",
  },
  assignBtn: {
    backgroundColor: "#2563eb !important",
    color: "#fff !important",
    fontSize: "12px !important",
    padding: "2px 12px !important",
    borderRadius: "6px !important",
    textTransform: "none !important",
  },
  cancelBtn: {
    fontSize: "12px !important",
    color: "#64748b !important",
    textTransform: "none !important",
  },

  /* ── Table ────────────────────────────────────────────────────────────── */
  tableWrap: {
    overflow: "auto",
    maxHeight: "calc(100vh - 180px)",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
  },
  table: {
    tableLayout: "fixed !important",
    borderCollapse: "separate !important",
    borderSpacing: "0 !important",
    minWidth: "100%",
  },

  /* ── Header cells ─────────────────────────────────────────────────────── */
  cornerHeader: {
    width: "120px !important",
    minWidth: "120px !important",
    backgroundColor: "#f8fafc !important",
    borderBottom: "2px solid #cbd5e1 !important",
    borderLeft: "2px solid #cbd5e1 !important",
    fontSize: "11px !important",
    fontWeight: "700 !important",
    color: "#334155 !important",
    padding: "6px 8px !important",
    position: "sticky !important",
    right: 0,
    zIndex: "4 !important",
  },
  cornerContent: {
    display: "flex",
    alignItems: "center",
  },
  dateHeader: {
    width: "42px !important",
    minWidth: "42px !important",
    maxWidth: "42px !important",
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
    fontWeight: 700,
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
  todayHeader: {
    backgroundColor: "#eff6ff !important",
    borderBottom: "2px solid #2563eb !important",
    "& div": {
      color: "#2563eb !important",
    },
  },

  /* ── Body cells ───────────────────────────────────────────────────────── */
  roomCell: {
    width: "120px !important",
    minWidth: "120px !important",
    backgroundColor: "#ffffff !important",
    borderBottom: "1px solid #e2e8f0 !important",
    borderLeft: "2px solid #e2e8f0 !important",
    padding: "3px 6px !important",
    position: "sticky !important",
    right: 0,
    zIndex: "2 !important",
  },
  roomCellContent: {
    display: "flex",
    alignItems: "flex-start",
  },
  roomInfo: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  roomIdRow: {
    display: "flex",
    alignItems: "center",
    gap: "3px",
  },
  roomId: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#1e293b",
  },
  roomFloor: {
    fontSize: "10px",
    color: "#94a3b8",
    fontWeight: 400,
  },
  roomGuestNames: {
    fontSize: "9px",
    color: "#475569",
    lineHeight: "1.3",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "88px",
    marginTop: "1px",
  },
  roomGuestMore: {
    color: "#94a3b8",
    fontStyle: "italic",
  },
  selectedRow: {
    "& $roomCell": {
      backgroundColor: "#eff6ff !important",
    },
  },
  dayCell: {
    width: "42px !important",
    minWidth: "42px !important",
    maxWidth: "42px !important",
    height: "30px !important",
    padding: "1px 2px !important",
    borderBottom: "1px solid #f1f5f9 !important",
    borderLeft: "1px solid #f1f5f9 !important",
    verticalAlign: "middle",
    transition: "opacity 0.1s",
    "&:hover": {
      opacity: 0.8,
    },
  },
  available: {
    backgroundColor: "#f0fdf4 !important",
    "&:hover": {
      backgroundColor: "#dcfce7 !important",
      opacity: "1 !important",
    },
  },
  weekendCol: {
    borderLeft: "1px solid #e2e8f0 !important",
  },
  todayCol: {
    borderLeft: "2px solid #2563eb !important",
    borderRight: "2px solid #2563eb",
  },

  /* Booking label inside a coloured cell */
  bookingLabel: {
    fontSize: "10px",
    fontWeight: 700,
    whiteSpace: "nowrap",
    overflow: "hidden",
    lineHeight: "1.2",
    padding: "0 2px",
  },
  bookingCapacity: {
    fontWeight: 400,
    fontSize: "9px",
    opacity: 0.8,
  },
}));
