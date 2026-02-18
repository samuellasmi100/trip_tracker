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
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    },
  },
  dataTableCell: {
    fontSize:"14px !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    borderBottom: "none !important",
  },
  headerTableRow: {
    fontSize: "15px !important",
    color: "#64748b !important",
    textAlign: "center !important",
    borderBottom: "none!important",
    fontWeight: "600 !important",
    "&.MuiTableCell-stickyHeader": {
      backgroundColor: "#ffffff !important",
    },
  },
  submitButton: {
    color: "#ffffff !important",
    fontSize: "1.125rem",
    textTransform: "capitalize !important",
    width: "168px",
    height: "32px",
    /* UI Properties */
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "10px",
    opacity: 1,
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.25)",
    "&:hover": {
      backgroundColor: "#0f766e !important",
    },
  },
  downloadButton: {
    width: "32px",
    height: "32px",
    background: "#24414B 0% 0% no-repeat padding-box",
    border: "1px solid #0d9488 ",
    borderRadius: "10px",
    opacity: 1,
  },
  textField: {
    borderRadius: 10,
    "& .MuiInputBase-input": {
        position: "relative",
        color: "#1e293b",
        fontSize: 14,
        padding: "5px 18px",
        height: "24px",
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
}));
