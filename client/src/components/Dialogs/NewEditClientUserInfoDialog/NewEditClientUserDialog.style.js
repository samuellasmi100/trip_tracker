import React from "react";

import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  dialog: {
    minWidth: "590px",
    height: "502px",
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
  header: {
    textAlign: "left",
    fontSize: "16px",
    color: "#ffffff",
    font: "Inter",
  },
  // resetPassword: {
  //   marginRight: "30px",
  //   marginTop: "30px",
  //   textTransform : "capitalize !important",
  //   background: "#FF9E54",
  //   borderRadius: "3px",
  //   color :"#ffffff",
  //   fontSize : "1rem",
  //   "&:hover":{
  //     background: "#cc7e43",

  //   }
  // },
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
        // top: "0px",
        borderColor: "#494C55",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#54A9FF",
      },
    },
  },
  textFieldPhone: {
    borderRadius: 4,
    "& .MuiInputBase-input": {
      position: "relative",
      color: "#FFFFFF",
      fontSize: 16,
      width: "135px",
      padding: "5px 18px",
      height: "24px",
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
        // top: "0px",
        borderColor: "#494C55",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#54A9FF",
      },
    },
  },
  cancelButton: {
    color: "#ffffff !important",
    fontSize: "1.125rem",
    textTransform: "capitalize !important",
    width: "136px",
    height: "32px",
    background: "#494C55 0% 0% no-repeat padding-box !important",
    borderRadius: "4px",
    opacity: 1,
  },
  select: {
    width: "231px",
    height: "32px",
    color: "white",
    backgroundColor: "#2D2D2D",
    border: "1px solid #494C55",
    "&.MuiSelect-select": {
      textTransform: "capitalize !important",
    },
    "&.MuiOutlinedInput-root": {
      color: "#ffffff !important",
    },
    "& .MuiSvgIcon-root": {
      color: "#54a9ff",
    },
  },
  dropdown: {
    width: "10px",
    "&.country-list": {
      top: 25,
      "& > .country": {
        "&.highlight": {
          backgroundColor: "blue",
        },
        "&:hover": {},
        "& > .country-name": {
          color: "black",
        },
      },
    },
  },
  button: {
    "&.flag-dropdown": {
      border: "1px solid #494C55 !important",
      backgroundColor: "#2D2D2D !important",
      "&.open": {
        backgroundColor: `#2D2D2D  !important`,
      },
      "&:focus": {},
      "& > .selected-flag": {
        width: "50px",
        borderRadius: "3px",

        "&:focus": {},
        "&.open": {
          backgroundColor: `#2D2D2D !important`,
        },
        "&:hover": {
          backgroundColor: `#2D2D2D !important`,
        },
        "& > *": {
          "& > .arrow": {
            left: "30px",
          },
          "& .arrow.up": {
            borderTop: "none",
          },
        },
      },
    },
  },
  input: {
    "&.form-control": {
      backgroundColor: `#2D2D2D !important`,
      color: `#494C55`,
    },
  },
  inputLabelStyle: {
    color: "#757882",
    fontSize: "15px",
  },
}));
