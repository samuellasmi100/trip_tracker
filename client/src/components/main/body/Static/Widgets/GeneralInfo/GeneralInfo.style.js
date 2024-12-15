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
        fontSize: "14px !important",
        color: "#ffffff !important",
        textAlign: "center !important",
        borderBottom: "none !important",
        whiteSpace: "nowrap",
      },
      headerTableRow: {
        whiteSpace: "nowrap",
        fontSize: "14px !important",
        color: "#5a5c62 !important",
        // textAlign: "center !important",
        borderBottom: "none!important",
        fontWeight: "600 !important",
        width: "5px !important",
        "&.MuiTableCell-stickyHeader": {
          backgroundColor: "#2d2d2d !important",
        },
      },
      textField: {
        borderRadius: 4,
    
        "& .MuiInputBase-input": {
          position: "relative",
          color: "#FFFFFF",
          fontSize: 16,
          width: "120px",
          padding: "5px 18px",
          height: "30px",
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
  

  selectOutline: {
    height: "35px",
    width: "80px",
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
selectFilterOutline: {
  height: "35px",
  width: "150px",
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
    // padding:"0px !important",
    

    
    "& Mui=Menu-list" :{
        padding:"0pz !important"
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