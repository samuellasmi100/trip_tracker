import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    inputLabelStyle: {
        color: "#757882 !important",
        fontSize: "15px",
    },
    cancelButton: {
        color: "#ffffff !important",
        fontSize: "1.125rem",
        textTransform: "capitalize !important",
        width: "136px",
        height: "32px",
        background: "#494C55 0% 0% no-repeat padding-box !important",
        borderRadius: "4px",
        opacity: 1,
    },
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
}));