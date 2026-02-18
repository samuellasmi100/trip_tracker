import React from "react";
import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({
    inputLabelStyle: {
        color: "#94a3b8 !important",
        fontSize: "15px",
    },
    textField: {
        borderRadius: 10,
        "& .MuiInputBase-input": {
            position: "relative",
            color: "#1e293b",
            fontSize: 14,
            width: "145px",
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
    textFieldPhone: {
        borderRadius: 10,
        "& .MuiInputBase-input": {
            position: "relative",
            color: "#1e293b",
            fontSize: 16,
            width: "115px",
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
                // top: "0px",
                borderColor: "#e2e8f0",
            },
            "&.Mui-focused fieldset": {
                borderColor: "#0d9488",
            },
        },
    },
    submitButton: {
        color: "#ffffff !important",
        fontSize: "1.125rem",
        textTransform: "capitalize !important",
        width: "168px",
        height: "32px",
        background: "linear-gradient(135deg, #0d9488 0%, #14b8a6 100%) !important",
        borderRadius: "10px",
        opacity: 1,
        boxShadow: "0 2px 8px rgba(13, 148, 136, 0.25)",
        "&:hover": {
            backgroundColor: "#0f766e !important",
        },
    },
    cancelButton: {
        color: "#64748b !important",
        fontSize: "1.125rem",
        textTransform: "capitalize !important",
        width: "136px",
        height: "32px",
        background: "#e2e8f0 !important",
        borderRadius: "10px",
        opacity: 1,
    },

}));
