import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  containerGrid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent !important",
  },

  button: {
    display: "flex",
    padding: "0",
    border: "none",
    transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "14px !important",
    "&:hover": {
      transform: "translateY(-4px)",
    },
  },
  dataGrid: {
    minHeight: "20vh",
    minWidth: "20vw",
    border: "1px solid #e2e8f0",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
    transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
    overflow: "hidden",
    "&:hover": {
      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.04)",
      borderColor: "#0d9488",
    },
  },
  header: {
    color: "#1e293b",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "600",
    paddingTop: "5px",
  },
  headerBox: {
    background: "linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)",
    width: "100%",
    height: "36px",
    flexShrink: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: "1px solid #e2e8f0",
  },
  textField: {
    borderRadius: 10,
    "& .MuiInputBase-input": {
      position: "relative",
      color: "#1e293b",
      fontSize: 16,
      width: "120px",
      padding: "5px 18px",
      height: "30px",
    },
    "& .MuiFormLabel-root": {
      color: "#94a3b8",
      fontSize: "14px",
    },
    "& label.Mui-focused": {
      color: "#0d9488",
      top: "0px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#0d9488",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#e2e8f0",
      },
      "&:hover fieldset": {
        borderColor: "#0d9488",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#0d9488",
      },
    },
  },
}));
