import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles({
  page: {
    minHeight: "100%",
    padding: "28px 32px",
    backgroundColor: "#f1f5f9",
    direction: "rtl",
  },

  // ── Top bar ─────────────────────────────────────────────────────────────
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "28px",
    flexWrap: "wrap",
    gap: "12px",
  },
  pageTitle: {
    fontSize: "22px",
    fontWeight: 700,
    color: "#0f172a",
    margin: 0,
  },
  topBarRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  lastUpdated: {
    fontSize: "12px",
    color: "#94a3b8",
  },

  // ── Vacation selector ───────────────────────────────────────────────────
  vacationSelect: {
    minWidth: "240px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
    },
  },

  // ── Cards grid ─────────────────────────────────────────────────────────
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    marginBottom: "24px",
  },

  // ── Metric card ─────────────────────────────────────────────────────────
  card: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
    border: "1px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    transition: "box-shadow 0.2s",
    "&:hover": {
      boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    },
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#64748b",
    margin: 0,
  },
  cardIconWrap: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconTeal: {
    backgroundColor: "rgba(13,148,136,0.1)",
    color: "#0d9488",
  },
  cardIconBlue: {
    backgroundColor: "rgba(59,130,246,0.1)",
    color: "#3b82f6",
  },
  cardIconPurple: {
    backgroundColor: "rgba(139,92,246,0.1)",
    color: "#8b5cf6",
  },
  cardIconAmber: {
    backgroundColor: "rgba(245,158,11,0.1)",
    color: "#f59e0b",
  },
  cardIconGreen: {
    backgroundColor: "rgba(22,163,74,0.1)",
    color: "#16a34a",
  },

  // Big number display
  bigNumber: {
    fontSize: "36px",
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1,
  },
  bigNumberSub: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "4px",
  },

  // Room occupancy progress
  progressLabel: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "6px",
  },
  progressBar: {
    height: "10px !important",
    borderRadius: "6px !important",
    backgroundColor: "#e2e8f0 !important",
    "& .MuiLinearProgress-bar": {
      backgroundColor: "#0d9488 !important",
      borderRadius: "6px",
    },
  },
  progressMeta: {
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "6px",
    textAlign: "left",
  },

  // Legend rows (for charts)
  legendRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#475569",
    marginTop: "4px",
  },
  legendDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    display: "inline-block",
    marginLeft: "8px",
    flexShrink: 0,
  },
  legendLeft: {
    display: "flex",
    alignItems: "center",
  },
  legendCount: {
    fontWeight: 700,
    color: "#0f172a",
  },

  // Chart container inside card
  chartWrap: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
  },
  chartCanvas: {
    width: "110px !important",
    height: "110px !important",
    flexShrink: 0,
  },
  legendList: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },

  // Empty / loading states
  emptyState: {
    color: "#94a3b8",
    fontSize: "13px",
    textAlign: "center",
    padding: "16px 0",
  },
  skeletonCard: {
    backgroundColor: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
    border: "1px solid #e2e8f0",
  },
});
