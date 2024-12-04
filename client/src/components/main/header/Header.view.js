import { Grid, Select, InputLabel, MenuItem, OutlinedInput } from "@mui/material";
import React from "react";
import { useStyles } from "./Header.style"
import { useSelector } from "react-redux";

function HeaderView({handleInputChange}) {
  const classes = useStyles();
  const vacationList = useSelector((state) => state.vacationSlice.vacations)
  return (
    <Grid style={{ height: "10vh", color: "white", display: 'flex', marginRight: "173px", paddingTop: "25px" }}>
      <Grid style={{display:"flex",flexDirection:"column"}}>
      <InputLabel className={classes.inputLabelStyle}>
       אנא בחר חופשה 
      </InputLabel>
      <Select
         onChange={handleInputChange}    
        input={
          <OutlinedInput
            className={classes.selectOutline}
          />
        }
        MenuProps={{
          PaperProps: {
            sx: {
              color: "#ffffff !important",
              bgcolor: "#222222",
            },
          },
        }}>
        {vacationList?.map((vacation) => (
          <MenuItem key={vacation.name} value={vacation.name} className={classes.selectedMenuItem}>
            {vacation.name}
          </MenuItem>
        ))}
      </Select>
      </Grid>
    </Grid>
  )
}

export default HeaderView;
