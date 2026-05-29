import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles(() => ({
  // Full-bleed RTL page with a calm gradient. Mobile-first: 16px gutter,
  // card spans full width up to 560px, then centers on larger screens.
  page: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 12px 40px",
    direction: "rtl",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(15, 23, 42, 0.10), 0 1px 3px rgba(15, 23, 42, 0.04)",
    width: "100%",
    maxWidth: "560px",
    overflow: "hidden",
    // Mobile-first stays as above (≤ 699px). Beyond ~700px the card
    // expands so desktop users aren't stuck in a phone-width column —
    // wide enough for the paper-form-style two-column orderer block.
    "@media (min-width: 700px)": {
      maxWidth: "1000px",
    },
  },
  hero: {
    background: "linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)",
    color: "#ffffff",
    padding: "28px 24px 24px",
    textAlign: "center",
    "@media (min-width: 700px)": {
      padding: "36px 40px 30px",
    },
  },
  logo: {
    height: "52px",
    width: "auto",
    objectFit: "contain",
    marginBottom: "10px",
    filter: "brightness(0) invert(1)",
  },
  vacationName: {
    fontSize: "18px !important",
    fontWeight: "700 !important",
    letterSpacing: "-0.2px",
    marginTop: "4px !important",
  },
  vacationSub: {
    fontSize: "13px !important",
    opacity: 0.85,
    marginTop: "2px !important",
  },
  body: {
    padding: "26px 24px 28px",
    "@media (min-width: 700px)": {
      padding: "32px 40px 36px",
    },
  },
  // Centered, generously-padded state cards (loading / error / signed-already).
  stateBlock: {
    textAlign: "center",
    padding: "30px 8px 12px",
  },
  stateIcon: {
    fontSize: "60px !important",
    marginBottom: "12px !important",
  },
  stateTitle: {
    fontSize: "20px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    marginBottom: "8px !important",
  },
  stateText: {
    fontSize: "14px !important",
    color: "#475569",
    lineHeight: "1.6 !important",
  },
  // Phone-verify gate.
  verifyIntro: {
    textAlign: "center",
    marginBottom: "18px",
  },
  verifyTitle: {
    fontSize: "18px !important",
    fontWeight: "700 !important",
    color: "#0f172a",
    marginBottom: "6px !important",
  },
  verifyHint: {
    fontSize: "13px !important",
    color: "#64748b",
    lineHeight: "1.6 !important",
  },
  verifyField: {
    "& .MuiInputBase-input": {
      textAlign: "center",
      letterSpacing: "8px",
      fontSize: "22px",
      fontWeight: 700,
      padding: "14px 12px",
      color: "#0f172a",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "& fieldset": { borderColor: "#cbd5e1" },
      "&:hover fieldset": { borderColor: "#94a3b8" },
      "&.Mui-focused fieldset": { borderColor: "#0d9488" },
    },
  },
  verifyError: {
    color: "#dc2626",
    fontSize: "13px !important",
    textAlign: "center",
    marginTop: "8px !important",
  },
  verifyButton: {
    width: "100%",
    marginTop: "16px !important",
    padding: "13px !important",
    color: "#ffffff !important",
    fontSize: "15px !important",
    fontWeight: "700 !important",
    textTransform: "none !important",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "12px !important",
    boxShadow: "0 4px 14px rgba(13, 148, 136, 0.30) !important",
    "&:hover": {
      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important",
    },
    "&:disabled": {
      background: "#e2e8f0 !important",
      color: "#94a3b8 !important",
      boxShadow: "none !important",
    },
  },
  footer: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "11px !important",
    color: "#94a3b8",
    letterSpacing: "0.2px",
  },
}));
