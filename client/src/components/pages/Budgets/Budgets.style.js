import { makeStyles } from "@mui/styles";

export const budgetColors = {
  primary: "#0d9488",
  primaryLight: "#14b8a6",
  textDark: "#1e293b",
  textMuted: "#64748b",
  textPlaceholder: "#94a3b8",
  border: "#e2e8f0",
  bgWhite: "#ffffff",
  bgOdd: "#f8fafc",
  bgHover: "#f1f5f9",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
};

export const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: "20px 30px",
    minHeight: "calc(100vh - 64px)",
    backgroundColor: "#f8fafc",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  tabs: {
    "& .MuiTabs-indicator": {
      backgroundColor: budgetColors.primary,
      height: "3px",
      borderRadius: "3px 3px 0 0",
    },
  },
  tab: {
    color: `${budgetColors.textMuted} !important`,
    fontWeight: "600 !important",
    fontSize: "15px !important",
    textTransform: "none !important",
    minWidth: "120px !important",
    "&.Mui-selected": {
      color: `${budgetColors.primary} !important`,
    },
  },
  addButton: {
    display: "inline-flex !important",
    alignItems: "center !important",
    flexDirection: "row !important",
    color: "#ffffff !important",
    fontSize: "14px !important",
    textTransform: "none !important",
    padding: "6px 20px !important",
    background: `linear-gradient(135deg, ${budgetColors.primary} 0%, ${budgetColors.primaryLight} 100%) !important`,
    borderRadius: "10px !important",
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.25) !important",
    "&:hover": {
      background: `linear-gradient(135deg, #0f766e 0%, ${budgetColors.primary} 100%) !important`,
    },
  },
  categoryButton: {
    display: "inline-flex !important",
    alignItems: "center !important",
    flexDirection: "row !important",
    color: `${budgetColors.textDark} !important`,
    fontSize: "14px !important",
    textTransform: "none !important",
    padding: "6px 16px !important",
    border: `1px solid ${budgetColors.border} !important`,
    borderRadius: "10px !important",
    backgroundColor: `${budgetColors.bgWhite} !important`,
    "&:hover": {
      backgroundColor: `${budgetColors.bgHover} !important`,
    },
  },
  settingsButton: {
    minWidth: "36px !important",
    width: "36px !important",
    height: "36px !important",
    padding: "6px !important",
    border: `1px solid ${budgetColors.border} !important`,
    borderRadius: "10px !important",
    backgroundColor: `${budgetColors.bgWhite} !important`,
    color: `${budgetColors.textMuted} !important`,
    "&:hover": {
      backgroundColor: `${budgetColors.bgHover} !important`,
      color: `${budgetColors.textDark} !important`,
    },
  },
}));
