import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
  dataTableBody: {
    "& tr:nth-of-type(odd)": {
      backgroundColor: "#ffffff",
    },
    "& tr:nth-of-type(even)": {
      backgroundColor: "#f8fafc",
    },
    "& tr": {
      transition: "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        backgroundColor: "#f0fdfa !important",
      },
    },
  },
  dataTableCell: {
    fontSize: "14px !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    borderBottom: "1px solid #f1f5f9 !important",
    padding: "12px 8px !important",
  },
  headerTableRow: {
    fontSize: "13px !important",
    color: "#64748b !important",
    textAlign: "center !important",
    borderBottom: "2px solid #e2e8f0 !important",
    fontWeight: "600 !important",
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    "&.MuiTableCell-stickyHeader": {
      backgroundColor: "#ffffff !important",
    },
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
  searchField: {
    borderRadius: 10,
    "& .MuiInputBase-input": {
      position: "relative",
      color: "#1e293b",
      fontSize: 14,
      width: "140px",
      padding: "8px 16px",
      height: "20px",
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
      borderRadius: "10px",
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
  inputLabelStyle: {
    color: "#94a3b8 !important",
    fontSize: "15px",
  },
  selectOutline: {
    height: "38px",
    width: "200px",
    borderRadius: "10px !important",
    "&.MuiOutlinedInput-root": {
      color: "#1e293b !important",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e2e8f0",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#0d9488",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#0d9488",
    },
  },
  selectedMenuItem: {
    backgroundColor: "#ffffff !important",
    color: "#1e293b !important",
    "& Mui=Menu-list": {
      padding: "0px !important"
    },
    "&.Mui-selected": {
      backgroundColor: "#f0fdfa !important",
      "&:hover": {
        backgroundColor: "#ccfbf1 !important",
      },
    },
    "&:hover": {
      backgroundColor: "#f8fafc !important",
    },
  },
  redText: {
    color: "#ef4444 !important",
    fontSize: "14px !important",
    textAlign: "center !important",
    borderBottom: "1px solid #f1f5f9 !important",
    fontWeight: "700 !important",
  },
}));
