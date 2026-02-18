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
  submitButton: {
    color: "#ffffff !important",
    fontSize: "0.9375rem",
    textTransform: "capitalize !important",
    width: "168px",
    height: "36px",
    background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
    borderRadius: "10px",
    opacity: 1,
    fontWeight: "600 !important",
    boxShadow: "0 2px 8px rgba(13, 148, 136, 0.3)",
    transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%) !important",
      boxShadow: "0 4px 12px rgba(13, 148, 136, 0.4)",
      transform: "translateY(-1px)",
    },
  },
  downloadButton: {
    width: "36px",
    height: "36px",
    background: "#f0fdfa",
    border: "1px solid #0d9488",
    borderRadius: "10px",
    opacity: 1,
    transition: "all 250ms cubic-bezier(0.4, 0, 0.2, 1)",
    "&:hover": {
      background: "#ccfbf1",
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
}));
