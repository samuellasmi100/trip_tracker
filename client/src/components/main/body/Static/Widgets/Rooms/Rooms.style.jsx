import React from "react";
import { makeStyles } from "@mui/styles";
import { Padding } from "@mui/icons-material";

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
    fontSize: "14px !important",
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
    width: "10px",
    "&.MuiTableCell-stickyHeader": {
      backgroundColor: "#ffffff !important",
    },
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

  tableTextField: {
    borderRadius: 10,
    textAlign: "center !important",
    "& .MuiInputBase-input": {
      color: "#1e293b",
      fontSize: "14px",
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
  greenText: {
    color: "green !important",
    fontSize: "15px !important",
    textAlign: "center !important",
    borderBottom: "none !important",
    fontWeight: "900 !important",
  },
  redText: {
    color: "#ef4444 !important",
    fontSize: "14px !important",
    textAlign: "center !important",
    borderBottom: "none !important",
    fontWeight: "900 !important",
  },
}));
