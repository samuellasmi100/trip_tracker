import React from "react";

import { makeStyles } from "@mui/styles";
export const useStyles = makeStyles((theme) => ({
  loginContainer: {
    height: "520px",
    width: "368px",
    background: "#262626 0% 0% no-repeat padding-box",
    boxShadow: "1px 1px 7px #00000091",
    borderRadius: "8px",
    opacity: 1,
  },
  loginPage: {
    height: "80vh",
    width: "50vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    fontSize : "2.226rem",
    font: "Inter",
    letterSpacing: 0,
    color: "#54A9FF",
    opacity: 1,
  },
  welcome: {
    textAlign: "center",
    font: "normal normal medium 24px/34px Inter",
    letterSpacing: 0,
    color: "#FFFFFF",
    opacity: 1,
  },
  inputContainer: {
    padding: "0px",
    margin: "0px",
    paddingTop: "5vh",
  },
  forgetpass: {
    textAlign: "right",
    textDecoration: "underline",
    fontSize: "1.125rem",
    font: "Inter",
    letterSpacing: 0,
    color: "#54A9FF",
    cursor: "pointer",
    opacity: 1,
  },
  loginPostRequest: {
    color: "#000000",
    background: "#54A9FF",
    borderRadius: "4px",
    width: "313px",
    fontWeight : "600",
    height: "40px",
  },
  input: {
    border: "1px solid #686B76",
    borderRadius: "4px",
    opacity: 1,
    maxWidth: "311px",
    width: "311px",
    height: "40px",
    maxHeight: "40px",
    marginBottom: "20px",
    "& .MuiInputBase-input": {
      color: "#ffffff",
      fontSize: "15px",
      marginRight:"10px"
    //   padding: "10px 10px 11px",
    },
  },
}));
