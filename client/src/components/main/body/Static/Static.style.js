import React from "react";
import { makeStyles } from "@mui/styles";
import { Padding } from "@mui/icons-material";

export const useStyles = makeStyles((theme) => ({
  containerGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2D2D2D !important",
  },

  button: {
    display: "flex", // Ensures proper alignment for the child
    padding: "0", // Removes default padding
    border: "none",
  },
  dataGrid: {
    minHeight: "20vh",
    minWidth: "20vw",
    border: "1px solid #494C55",
    borderRadius: "4px",
  },
  header: {
    color: "var(--Primary-text, #FFF)",
    fontSize: "14px",
    fontStyle: "normal",
    fontWeight: "500",
    paddingTop: "5px",
  },
  headerBox: {
    background: "var(--Inputs-on-modal, #39393C)",
    width: "100%",
    height: "32px",
    flexShrink: "0",
  },
  textField: {
    borderRadius: 4,
  
    "& .MuiInputBase-input": {
        position: "relative",
        color: "#FFFFFF",
        fontSize: 16,
        width: "120px",
        padding: "5px 18px",
        height: "30px",
    },
    "& .MuiFormLabel-root": {
        color: "#757882", // or black
        fontSize: "14px",
    },
    "& label.Mui-focused": {
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
            borderColor: "#494C55",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#54A9FF",
        },
    },
},
}));
