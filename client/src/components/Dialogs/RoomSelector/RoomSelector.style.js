import { makeStyles } from "@mui/styles";

export const useStyles = makeStyles((theme) => ({

    inputLabelStyle: {
        color: "#757882 !important",
        fontSize: "15px" 
    },

    inputSelectLabelStyle: {
        color: "#757882 !important",
        fontSize: "15px",
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

      textField: {
        borderRadius: 4,
        "& .MuiInputBase-input": {
            position: "relative",
            color: "#FFFFFF",
            fontSize: 14,
            width: "90px",
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
    shortTextField: {
      borderRadius: 4,
      "& .MuiInputBase-input": {
          position: "relative",
          color: "#FFFFFF",
          fontSize: 14,
          width: "50px",
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
  shortTextField2: {
    borderRadius: 4,
    "& .MuiInputBase-input": {
        position: "relative",
        color: "#FFFFFF",
        fontSize: 14,
        width: "25px",
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
sizeTextField: {
    borderRadius: 4,
    "& .MuiInputBase-input": {
        position: "relative",
        color: "#FFFFFF",
        fontSize: 14,
        width: "25px",
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
delete:{
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '21px',
    cursor: 'pointer',
    color:"red"
}
}));