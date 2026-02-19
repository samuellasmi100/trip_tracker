import React from "react";
import { Select, MenuItem, OutlinedInput } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as budgetSlice from "../../../../../store/slice/budgetSlice";

const StatusFilter = () => {
  const dispatch = useDispatch();
  const statusFilter = useSelector((state) => state.budgetSlice.statusFilter);

  return (
    <Select
      value={statusFilter}
      onChange={(e) => dispatch(budgetSlice.setStatusFilter(e.target.value))}
      input={
        <OutlinedInput
          sx={{
            height: "36px",
            width: "150px",
            borderRadius: "10px",
            fontSize: "14px",
            color: "#1e293b",
            backgroundColor: "#ffffff",
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e2e8f0",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#cbd5e1",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#0d9488",
            },
          }}
        />
      }
      MenuProps={{
        PaperProps: {
          sx: { bgcolor: "#ffffff", color: "#1e293b" },
        },
      }}
    >
      <MenuItem value="all">הכל</MenuItem>
      <MenuItem value="paid">שולם</MenuItem>
      <MenuItem value="planned">מתוכנן</MenuItem>
      <MenuItem value="overdue">באיחור</MenuItem>
    </Select>
  );
};

export default StatusFilter;
