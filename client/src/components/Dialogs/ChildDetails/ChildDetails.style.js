import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    inputLabelStyle: {
        color: "#94a3b8 !important",
        fontSize: "15px",
    },
    cancelButton: {
        color: "#64748b !important",
        fontSize: "1.125rem",
        textTransform: "capitalize !important",
        width: "136px",
        height: "32px",
        background: "#e2e8f0 !important",
        borderRadius: "10px",
        opacity: 1,
    },
    dataTableBody: {
        "& tr:nth-of-type(odd)": {
          backgroundColor: "#f8fafc",
        },
        "& tr:nth-of-type(even)": {
          backgroundColor: "#ffffff",
        },
        "& tr": {
          transition: "background-color 0.2s ease",
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
}));
