import React from "react";
import { makeStyles } from "@mui/styles";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

export const useStyles = makeStyles((theme) => ({
  dialog: {
    color: "#1e293b !important",
    backgroundColor: "#ffffff  !important",
    width:"25vw"
  },
  dataTableBody: {
    "& tr:nth-of-type(odd)": {
      backgroundColor: "#f8fafc",
    },
    "& tr:nth-of-type(even)": {
      backgroundColor: "#ffffff",
    },
    "& tr": {
      transition: "background-color 0.15s ease",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    },
  },
  dataTableCell: {
    fontSize: "14px !important",
    color: "#1e293b !important",
    textAlign: "center !important",
    borderBottom: "none !important",
  },
  dataTableCell2: {
    fontSize: "14px !important",
    color: "#ce2525 !important",
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
  searchField: {
    borderRadius: 10,

    "& .MuiInputBase-input": {
      position: "relative",
      color: "#1e293b",
      fontSize: 16,
      width: "120px",
      padding: "5px 18px",
      height: "25px",
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
  selectOutline: {
    height: "35px",
    width: "180px",
    "&.MuiOutlinedInput-root": {
      color: "#1e293b !important",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#e2e8f0",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#0d9488",
    },
  },
  selectedMenuItem: {
    backgroundColor: "#ffffff !important",

    "& Mui=Menu-list": {
      padding: "0px !important"
    },
    "&.Mui-selected": {
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "#f1f5f9",
      },
    },
    "&:hover": {
      backgroundColor: "#f1f5f9",
    },
  },
  redText: {
    color: "#ef4444 !important",
    fontSize: "14px !important",
    textAlign: "center !important",
    borderBottom: "none !important",
    fontWeight: "900 !important",
  },
}));

export const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: 'white',
    maxWidth: 300,
    paddingTop:"10px",
    height : 30,
    fontSize: "15px",
  },
}));
