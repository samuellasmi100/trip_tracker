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
}));
