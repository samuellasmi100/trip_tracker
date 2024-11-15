import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import { useStyles } from "./SearchInput.style";
import SearchIcon from "@mui/icons-material/Search";

const SearchInputView = (props) => {
  const classes = useStyles();
  return (
    <TextField
      className={classes.textField}
      placeholder={props.placeholder ? props.placeholder : "חיפוש"}
      onChange={props.onChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon style={{ color: "#54A9FF" }} size="large" />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchInputView;
