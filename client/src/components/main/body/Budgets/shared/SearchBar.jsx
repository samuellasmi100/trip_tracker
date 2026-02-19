import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useDispatch, useSelector } from "react-redux";
import * as budgetSlice from "../../../../../store/slice/budgetSlice";

const SearchBar = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector((state) => state.budgetSlice.searchTerm);

  return (
    <TextField
      size="small"
      placeholder="חיפוש..."
      value={searchTerm}
      onChange={(e) => dispatch(budgetSlice.setSearchTerm(e.target.value))}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon sx={{ color: "#0d9488", fontSize: 20 }} />
          </InputAdornment>
        ),
      }}
      sx={{
        width: "220px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "10px",
          fontSize: "14px",
          backgroundColor: "#ffffff",
          "& fieldset": { borderColor: "#e2e8f0" },
          "&:hover fieldset": { borderColor: "#cbd5e1" },
          "&.Mui-focused fieldset": { borderColor: "#0d9488" },
        },
      }}
    />
  );
};

export default SearchBar;
