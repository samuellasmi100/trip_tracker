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
        fontSize: "12px !important",
        color: "#ffffff !important",
        textAlign: "center !important",
        borderBottom: "none !important",
        whiteSpace: "nowrap",
          width:'10px'
      },
      headerTableRow: {
        whiteSpace: "nowrap",
        fontSize: "12px !important",
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
    
      tableTextField: {
        borderRadius: 4,
        textAlign: "center !important",
        "& .MuiInputBase-input": {
          color: "#FFFFFF",
          fontSize: "14px",
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
      shortTxtField: {
        borderRadius: 4,
        "& .MuiInputBase-input": {
            position: "relative",
            color: "#FFFFFF",
            fontSize: 14,
            width: "105px",
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
    inputLabelStyle: {
      color: "#757882 !important",
      fontSize: "15px",
  },
}));