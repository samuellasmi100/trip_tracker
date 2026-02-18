import React from "react";

import { makeStyles } from "@mui/styles";
import { BorderBottom } from "@mui/icons-material";

export const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: "620px",
    height: "580px",
    color: "#1e293b !important",
    backgroundColor: "#ffffff !important",

  },

  navButton:{
    color: "#94a3b8 !important",
    fontSize: "2px",
    textTransform: "capitalize !important",
    height: "32px",
    borderRadius: "10px",
    opacity: 1,
    "&.active": {
      border:"1px solid #94a3b8 !important",
    },
  }
}));
