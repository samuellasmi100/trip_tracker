import React from "react";

import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: "720px",
    maxWidth: "95vw",
    maxHeight: "90vh",
    color: "#1e293b !important",
    backgroundColor: "#ffffff !important",
    borderRadius: "16px !important",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.06) !important",
    padding: "0 8px",
    overflowX: "hidden",
    overflowY: "auto",
  },

  navButton: {
    color: "#64748b !important",
    fontSize: "13px !important",
    textTransform: "capitalize !important",
    height: "36px",
    borderRadius: "10px !important",
    opacity: 1,
    fontWeight: "500 !important",
    padding: "6px 16px !important",
    transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) !important",
    "&:hover": {
      backgroundColor: "#f1f5f9 !important",
      color: "#0d9488 !important",
    },
    "&.active": {
      backgroundColor: "#f0fdfa !important",
      color: "#0d9488 !important",
      border: "1px solid #0d9488 !important",
      fontWeight: "600 !important",
    },
  }
}));
