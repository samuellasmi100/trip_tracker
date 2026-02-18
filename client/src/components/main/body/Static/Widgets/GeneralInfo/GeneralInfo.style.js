import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    dataTableBody: {
        "& tr:nth-of-type(odd)": {
          backgroundColor: "#f8fafc",
        },
        "& tr:nth-of-type(even)": {
          backgroundColor: "#ffffff",
        },
        "& tr": {
          transition: "background-color 0.15s ease",
        },
        "& tr:hover": {
          backgroundColor: "#f0fdfa !important",
        },
      },
      dataTableCell: {
        fontSize: "12px !important",
        color: "#1e293b !important",
        textAlign: "center !important",
        borderBottom: "none !important",
        whiteSpace: "nowrap",
        padding: "6px 8px !important",
      },
      headerTableRow: {
        whiteSpace: "nowrap",
        fontSize: "12px !important",
        color: "#64748b !important",
        textAlign: "center !important",
        borderBottom: "1px solid #e2e8f0 !important",
        fontWeight: "600 !important",
        padding: "8px !important",
        "&.MuiTableCell-stickyHeader": {
          backgroundColor: "#ffffff !important",
        },
      },
      textField: {
        borderRadius: 10,

        "& .MuiInputBase-input": {
          position: "relative",
          color: "#1e293b",
          fontSize: 13,
          width: "140px",
          padding: "6px 12px",
          height: "20px",
        },
        "& .MuiFormLabel-root": {
          color: "#94a3b8", // or black
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
            borderColor: "#e2e8f0",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#0d9488",
          },
        },
      },


  selectOutline: {
    height: "35px",
    width: "80px",
    "&.MuiOutlinedInput-root": {
      color: "#1e293b !important",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e2e8f0",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#0d9488",
    },
},
selectFilterOutline: {
  height: "32px",
  width: "140px",
  fontSize: "13px !important",
  "&.MuiOutlinedInput-root": {
    color: "#1e293b !important",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e2e8f0",
    },
  },
  "& .MuiSvgIcon-root": {
    color: "#0d9488",
  },
},
selectedMenuItem: {
    backgroundColor: "#ffffff !important",
    // padding:"0px !important",



    "& Mui=Menu-list" :{
        padding:"0pz !important"
    },
    "&.Mui-selected": {
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    },
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },

},
}));
