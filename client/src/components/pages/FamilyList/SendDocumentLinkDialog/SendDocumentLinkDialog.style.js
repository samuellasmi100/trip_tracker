import { makeStyles } from "@mui/styles";

// Styles specific to the multi-surname mode selector. The shared dialog chrome
// (paper/title/summaryCard/channel buttons) is still reused from
// SendRegistrationDialog.style — these only cover the two-choice picker shown
// when a family spans more than one hebrew_last_name: send ONE link for the
// whole family, or ONE "split" link whose page lets the head forward per-surname
// links himself. Either way the secretary sends a single link to the head.
export const useStyles = makeStyles(() => ({
  chooserLabel: {
    fontSize: "13px !important",
    fontWeight: "600 !important",
    color: "#334155",
    marginBottom: "8px !important",
  },
  optionList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginBottom: "16px",
  },
  // A selectable card. The active one is teal-tinted; the other stays neutral.
  option: {
    textAlign: "right",
    border: "1.5px solid #e2e8f0",
    background: "#ffffff",
    borderRadius: "10px",
    padding: "10px 12px",
    cursor: "pointer",
    transition: "border-color .15s, background .15s",
    "&:hover": { borderColor: "#99f6e4" },
  },
  optionActive: {
    borderColor: "#0d9488",
    background: "#f0fdfa",
  },
  optionTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#0f172a",
  },
  optionDesc: {
    fontSize: "12px",
    color: "#64748b",
    lineHeight: 1.5,
    marginTop: "3px",
  },
  radioDot: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    border: "2px solid #cbd5e1",
    flexShrink: 0,
    position: "relative",
  },
  radioDotActive: {
    borderColor: "#0d9488",
    "&::after": {
      content: '""',
      position: "absolute",
      inset: "2px",
      borderRadius: "50%",
      background: "#0d9488",
    },
  },
}));
