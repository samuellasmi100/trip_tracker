import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    inputLabelStyle: {
        color: "#757882 !important",
        fontSize: "15px",
        marginBottom:"8px"
    },
    textField: {
        borderRadius: 4,
        "& .MuiInputBase-input": {
            position: "relative",
            color: "#FFFFFF",
            fontSize: 16,
            width: "auto",
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
    dateTextField:{
        borderRadius: 4,
        "& .MuiInputBase-input": {
            position: "relative",
            color: "#FFFFFF",
            fontSize: 16,
            width: "196px",
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
    textFieldPhone: {
        borderRadius: 4,
        "& .MuiInputBase-input": {
            position: "relative",
            color: "#FFFFFF",
            fontSize: 16,
            width: "115px",
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
                // top: "0px",
                borderColor: "#494C55",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#54A9FF",
            },
        },
    },
    submitButton: {
        color: "#000000 !important",
        fontSize: "1.125rem",
        textTransform: "capitalize !important",
        width: "168px",
        height: "32px",
        background: "#54A9FF 0% 0% no-repeat padding-box !important",
        borderRadius: "4px",
        opacity: 1,
        "&:hover": {
            backgroundColor: "#2692ff !important",
        },
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