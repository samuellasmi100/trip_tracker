import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  cardsRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  chartsRow: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },
  chartCard: {
    flex: 1,
    minWidth: "300px",
    backgroundColor: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  chartTitle: {
    color: "#1e293b",
    fontWeight: "600 !important",
    fontSize: "15px !important",
    marginBottom: "16px !important",
    textAlign: "center",
  },
}));
