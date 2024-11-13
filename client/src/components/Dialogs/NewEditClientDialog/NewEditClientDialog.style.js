import React from "react";

import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  dialog: {
    width: "400px",
    height: "302px",
    color: "#FFFFFF !important",
    backgroundColor: "#2D2D2D !important",
  },
  cancelButton: {
    color: "#ffffff !important",
    fontSize: "1.125rem",
    textTransform: "capitalize !important",
    width: "136px",
    height: "32px",
    /* UI Properties */
    background: "#494C55 0% 0% no-repeat padding-box !important",
    borderRadius: "4px",
    opacity: 1,
  },
  submitButton: {
    color: "#000000 !important",
    fontSize: "1.125rem",
    textTransform: "capitalize !important",
    width: "168px",
    height: "32px",
    /* UI Properties */
    background: "#54A9FF 0% 0% no-repeat padding-box !important",
    borderRadius: "4px",
    opacity: 1,
    "&:hover": {
      backgroundColor: "#2692ff !important",
    },
  },
  textField: {
    borderRadius: 4,
    "& .MuiInputBase-input": {
      position: "relative",
      color: "#FFFFFF",
      fontSize: 16,
      width: "auto",
      padding: "5px 18px",
      height: "24px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#54A9FF",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#494C55",
      },
      "&:hover fieldset": {
        borderColor: "#494C55",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#54A9FF",
      },
    },
  },
  inputLabelStyle: {
    color: "#757882",
    fontSize: "15px",
  },
}));
