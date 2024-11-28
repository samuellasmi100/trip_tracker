import React from "react";
import { makeStyles } from "@mui/styles";
import { Padding } from "@mui/icons-material";

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
    width:"10px",
    "&.MuiTableCell-stickyHeader": {
      backgroundColor: "#2d2d2d !important",
    },
  },
}));
