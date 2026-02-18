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
    borderRight: "2px solid #e2e8f0 !important",

    whiteSpace: "nowrap",
    // fontSize:"14px !important",
    color: "#1e293b !important",
    // textAlign: "center !important",
    // borderBottom: "none !important",
  },
  headerTableRow: {
    borderRight: "2px solid #e2e8f0 !important",
    // whiteSpace: "nowrap",
    fontSize: "13px !important",
    color: "#64748b !important",
    // borderBottom: "none !important",
    fontWeight: "600 !important",
    "&.MuiTableCell-stickyHeader": {
      backgroundColor: "#ffffff !important",
    },
  },


}));
