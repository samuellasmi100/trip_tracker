import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  // textField: {
  //   borderRadius: 4,
  //   border: "1px solid red",
  //   "& .MuiInputBase-input": {
  //     position: "relative",
  //     color: "#FFFFFF",
  //     fontSize: 16,
  //     padding: "5px 18px",
  //     height: "24px",
  //   },
  //   "@media (max-width: 2558px)": {
  //     width: 235,
  //   },
  //   "@media (max-width: 1573px)": {
  //     width: 200,
  //   },
   
  //   "@media (max-width: 1472px)": {
  //     width: 150,
  //   },
  // },
  textField: {
    borderRadius: 4,
    "& .MuiInputBase-input": {
        position: "relative",
        color: "#FFFFFF",
        fontSize: 16,
        width: "90px",
        borderRadius:"4px",
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
            borderColor: "#494C55",
        },
        "&.Mui-focused fieldset": {
            borderColor: "#54A9FF",
        },
    },
},
}));
