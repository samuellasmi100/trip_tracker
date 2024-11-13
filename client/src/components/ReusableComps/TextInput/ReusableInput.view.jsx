import React from "react";
import {  TextField } from "@mui/material";
import { useStyles } from "./ReusableInput.style";

const ReusableInputView = (props) => {
  const { type, onChange, placeHolder, value, label,  } = props;
  const classes = useStyles();
  return (
    <TextField
      className={classes.textField}
      value={value}
      label={label}
      onChange={(e) => onChange(e)}
    />
  );
};

export default ReusableInputView;
