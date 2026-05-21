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
        borderBottom: "1px solid #f1f5f9 !important",
        whiteSpace: "nowrap",
        padding: "10px 12px !important",
        verticalAlign: "top !important",
      },
      routesCell: {
        fontSize: "12px !important",
        color: "#1e293b !important",
        textAlign: "start !important",
        borderBottom: "1px solid #f1f5f9 !important",
        padding: "8px 12px !important",
        verticalAlign: "top !important",
      },
      routeChip: {
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "4px 10px",
        marginBottom: "4px",
        backgroundColor: "#f8fafc",
        borderRadius: "6px",
        border: "1px solid #e2e8f0",
        fontSize: "11px",
        color: "#334155",
        whiteSpace: "nowrap",
        "&:last-child": {
          marginBottom: 0,
        },
      },
      routeName: {
        fontWeight: 600,
        color: "#0f172a",
        fontSize: "11px",
      },
      routeDates: {
        color: "#64748b",
        fontSize: "11px",
      },
      headerTableRow: {
        fontSize: "12px !important",
        color: "#64748b !important",
        textAlign: "center !important",
        borderBottom: "2px solid #e2e8f0 !important",
        fontWeight: "600 !important",
        whiteSpace: "nowrap",
        padding: "10px 12px !important",
        backgroundColor: "#f8fafc !important",
        "&.MuiTableCell-stickyHeader": {
          backgroundColor: "#f8fafc !important",
        },
      },
      vacationName: {
        fontWeight: "600 !important",
        fontSize: "13px !important",
        color: "#0f172a !important",
      },
      countBadge: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#e0f2fe",
        color: "#0369a1",
        fontWeight: 600,
        fontSize: "11px",
        borderRadius: "12px",
        padding: "2px 10px",
        minWidth: "24px",
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
      shortTxtField: {
        borderRadius: 10,
        "& .MuiInputBase-input": {
            position: "relative",
            color: "#1e293b",
            fontSize: 14,
            width: "105px",
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
    inputLabelStyle: {
      color: "#94a3b8 !important",
      fontSize: "15px",
  },
}));
