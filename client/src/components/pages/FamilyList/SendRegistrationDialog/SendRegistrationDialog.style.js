import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  paper: {
    borderRadius: "16px !important",
    padding: "4px",
    direction: "rtl",
    width: "100%",
    maxWidth: "440px !important",
  },
  title: {
    fontSize: "18px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    paddingBottom: "0 !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  closeBtn: {
    color: "#64748b !important",
    padding: "4px !important",
  },
  body: {
    paddingTop: "12px !important",
  },
  // Read-only summary card at the top — confirms which family + link the
  // coordinator is about to share, before they pick a channel.
  summaryCard: {
    background: "#f0fdfa",
    border: "1px solid #ccfbf1",
    borderRadius: "10px",
    padding: "12px 14px",
    marginBottom: "16px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#0f172a",
    padding: "3px 0",
  },
  summaryLabel: {
    color: "#64748b",
    fontWeight: 500,
  },
  summaryValue: {
    fontWeight: 600,
    direction: "ltr", // dates/expiry render LTR-natural
  },
  linkPreview: {
    fontSize: "11px",
    color: "#0d9488",
    direction: "ltr",
    background: "#ffffff",
    border: "1px solid #ccfbf1",
    borderRadius: "8px",
    padding: "8px 10px",
    marginTop: "6px",
    wordBreak: "break-all",
    fontFamily: "monospace",
  },
  // Three-button column. Stacked, full-width, generous tap targets so it
  // works on mobile.
  buttonStack: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "8px",
  },
  channelButton: {
    width: "100%",
    padding: "12px !important",
    fontSize: "14px !important",
    fontWeight: "600 !important",
    textTransform: "none !important",
    borderRadius: "12px !important",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
  },
  whatsappButton: {
    background: "#25d366 !important",
    color: "#ffffff !important",
    boxShadow: "0 4px 14px rgba(37, 211, 102, 0.30) !important",
    "&:hover": { background: "#128c7e !important" },
  },
  emailButton: {
    background: "#0d9488 !important",
    color: "#ffffff !important",
    boxShadow: "0 4px 14px rgba(13, 148, 136, 0.30) !important",
    "&:hover": { background: "#0f766e !important" },
    "&.Mui-disabled": {
      background: "#e2e8f0 !important",
      color: "#94a3b8 !important",
      boxShadow: "none !important",
    },
  },
  copyButton: {
    background: "#ffffff !important",
    color: "#0f172a !important",
    border: "1.5px solid #0d9488 !important",
    "&:hover": { background: "#f0fdfa !important" },
  },
}));
