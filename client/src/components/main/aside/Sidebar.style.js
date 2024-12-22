import React from "react";
import { makeStyles } from "@mui/styles";
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

export const useStyles = makeStyles((theme) => ({
  sideBarIcons: {
    paddingBottom: "20px",
    paddingTop: "20px",
    borderRadius: "0 4px 4px 0",
  },
  sideBarSx: {
    left: "0px",
    backgroundColor: "#343536 !important",
    // borderRadius: "0 8px 8px 0",
  },
  logoutToolTip: {
    fontSize: "16px",
    "&:hover": {
      cursor: "pointer",
    },
  },
  tooltip: {
    fontSize: "20px",
    
  },
}));

export const StyledTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: 'white',
    maxWidth: 220,
    height : 20,
    fontSize: theme.typography.pxToRem(20),
  },
}));