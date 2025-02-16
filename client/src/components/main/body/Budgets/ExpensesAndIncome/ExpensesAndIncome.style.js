import React from "react";
import { makeStyles } from "@mui/styles";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

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
    fontSize: "14px !important",
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

  textField: {
    borderRadius: 4,
    "& .MuiInputBase-input": {
      position: "relative",
      color: "#FFFFFF",
      fontSize: 14,
      padding: "5px 18px",
      height: "24px",
    },
    "& .MuiFormLabel-root": {
      color: "#757882", // or black
      fontSize: "14px",
    },
    "& label.Mui-focused": {
      color: "#54A9FF",
      top: "0px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#54A9FF",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#494C55",
      },
      "&:hover fieldset": {
        borderColor: "#494C55",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#54A9FF",
      },
    },
  },
  searchField: {
    borderRadius: 4,

    "& .MuiInputBase-input": {
      position: "relative",
      color: "#FFFFFF",
      fontSize: 16,
      width: "120px",
      padding: "5px 18px",
      height: "25px",
    },
    "& .MuiFormLabel-root": {
      color: "#757882", // or black
      fontSize: "14px",
    },
    "& label.Mui-focused": {
      color: "#54A9FF",
      top: "0px",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#54A9FF",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#494C55",
      },
      "&:hover fieldset": {
        borderColor: "#494C55",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#54A9FF",
      },
    },
  },
  inputLabelStyle: {
    color: "#757882 !important",
    fontSize: "15px",
  },
  selectOutline: {
    height: "35px",
    width: "180px",
    "&.MuiOutlinedInput-root": {
      color: "#ffffff !important",
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "#494c55",
      },
    },
    "& .MuiSvgIcon-root": {
      color: "#54a9ff",
    },
  },
  selectedMenuItem: {
    backgroundColor: "#2D2D2D !important",

    "& Mui=Menu-list": {
      padding: "0px !important"
    },
    "&.Mui-selected": {
      backgroundColor: "transparent",
      "&:hover": {
        backgroundColor: "#3C3E43",
      },
    },
    "&:hover": {
      backgroundColor: "#3C3E43",
    },
  },
  redText: {
    color: "red !important",
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