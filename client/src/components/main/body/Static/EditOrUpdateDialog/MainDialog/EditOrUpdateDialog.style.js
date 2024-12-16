import React from "react";

import { makeStyles } from "@mui/styles";
import { BorderBottom } from "@mui/icons-material";

export const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: "620px",
    height: "580px", 
    color: "#FFFFFF !important",
    backgroundColor: "#2D2D2D !important",
  
  },

  navButton:{
    color: "#757882 !important",
    fontSize: "2px",
    textTransform: "capitalize !important",
    height: "32px",
    borderRadius: "4px",
    opacity: 1,
    "&.active": {
      border:"1px solid #757882 !important",
    },
  }
}));
