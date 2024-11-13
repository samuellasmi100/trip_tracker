import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  textField: {
    borderRadius: 4,
    border: "1px solid #494C55",
    "& .MuiInputBase-input": {
      position: "relative",
      color: "#FFFFFF",
      fontSize: 16,
      padding: "5px 18px",
      height: "24px",
    },
    "@media (max-width: 2558px)": {
      width: 235,
    },
    "@media (max-width: 1573px)": {
      width: 200,
    },
   
    "@media (max-width: 1472px)": {
      width: 150,
    },
  },
}));
