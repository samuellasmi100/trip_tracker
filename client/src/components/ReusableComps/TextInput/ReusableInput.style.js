import React from "react";

import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  textField: {
    borderRadius: 4,
    // border: "1px solid #494C55",
    "& .MuiInputBase-input": {
      position: "relative",
      color: "#FFFFFF",
      fontSize: 16,
      width: "auto",
      padding: "5px 18px",
      height: "24px",
    },
    "& .MuiFormLabel-root": {
      color: "#757882", // or black
      fontSize: "14px",
      textTransform: "capitalize",
    },
    "& label.Mui-focused": {
      textTransform: "capitalize",
      color: "#54A9FF",
      top: "0px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#54A9FF",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#494C55",
      },
      "&:hover fieldset": {
        // top: "0px",
        borderColor: "#494C55",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#54A9FF",
      },
    },
  },
}));
