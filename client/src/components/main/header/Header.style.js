import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    inputLabelStyle: {
        color: "#757882 !important",
        fontSize: "15px",
    },
    selectOutline: {
        height: "35px",
         width:"180px",
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
        
        "& Mui=Menu-list" :{
            padding:"0px !important"
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
}));
