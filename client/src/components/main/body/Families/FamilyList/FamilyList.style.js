import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
   dataTableBody: {
    "& tr:nth-of-type(odd)": {
      backgroundColor: "#222222",
    },
    "& tr:nth-of-type(even)": {
      backgroundColor: "#2d2d2d",
    },
  },
  dataTableCell: {
    fontSize:"14px !important",
    color: "#ffffff !important",
    textAlign: "center !important",
    borderBottom: "none !important",
  },
  headerTableRow: {
    fontSize: "15px !important",
    color: "#5a5c62 !important",
    textAlign: "center !important",
    borderBottom: "none!important",
    fontWeight: "600 !important",
    "&.MuiTableCell-stickyHeader": {
      backgroundColor: "#2d2d2d !important",
    },
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
  downloadButton: {
    width: "32px",
    height: "32px",
    background: "#24414B 0% 0% no-repeat padding-box",
    border: "1px solid #54A9FF ",
    borderRadius: "4px",
    opacity: 1,
  },
  textField: {
    borderRadius: 4,
    "& .MuiInputBase-input": {
        position: "relative",
        color: "#FFFFFF",
        fontSize: 14,
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
searchField: {
  borderRadius: 4,

  "& .MuiInputBase-input": {
      position: "relative",
      color: "#FFFFFF",
      fontSize: 16,
      width: "120px",
      padding: "5px 18px",
      height: "25px",
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
