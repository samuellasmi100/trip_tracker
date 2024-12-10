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
    borderRight: "2px solid #3D3F47 !important",

    whiteSpace: "nowrap",
    // fontSize:"14px !important",
    color: "#ffffff !important",
    // textAlign: "center !important",
    // borderBottom: "none !important",
  },
  headerTableRow: {
    borderRight: "2px solid #3D3F47 !important",
    // whiteSpace: "nowrap",
    fontSize: "13px !important",
    color: "#5a5c62 !important",
    // borderBottom: "none !important",
    fontWeight: "600 !important",
    "&.MuiTableCell-stickyHeader": {
      backgroundColor: "#2d2d2d !important",
    },
  },


}));
