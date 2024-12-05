import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import { useStyles } from "./Reservation.style";
import "./Reservation.css";
import { useDispatch, useSelector } from "react-redux";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import moment from 'moment';
import Flights from "./Flights/Flights"

const ReservationView = (props) => {;
  const form = useSelector((state) => state.userSlice.form);

  const classes = useStyles();
  const { handleInputChange, submit,handleCloseClicked } = props;
  const dialogType = useSelector((state) => state.dialogSlice.type)
 const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates)
 
  const handleFlightsCheckbox = () => {
      return <Flights handleInputChange={handleInputChange}/>
  }
  return (
    <>
      <Grid container style={{height: "400px", padding: "20px" }}>
      {dialogType === "editParent" || dialogType === "addFamily"? 
      
        <Grid item xs={6}>
           <Grid container spacing={2} justifyContent="center">
           <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
               בחר מסלול
              </InputLabel>
              {console.log(form)}
               <Select
                name="week_chosen"
                value={form.week_chosen}
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
          {vacationsDates?.map((type) => (
            <MenuItem key={type} value={type.name} className={classes.selectedMenuItem}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
            </Grid>
           <Grid item>
             <InputLabel className={classes.inputLabelStyle}>
               כמות נופשים
             </InputLabel>
             <TextField
               name="number_of_guests"
               value={form.number_of_guests}
               className={classes.textField}
               onChange={handleInputChange}
             />
           </Grid>

           <Grid item>
             <InputLabel className={classes.inputLabelStyle}>
               כמות חדרים
             </InputLabel>
             <TextField
               name="number_of_rooms"
               value={form.number_of_rooms}
               className={classes.textField}
               onChange={handleInputChange}
             />
           </Grid>
         </Grid> 
          
         
        </Grid>
        :<></>}

           <Grid item xs={dialogType === "editParent" || dialogType === "addFamily" ? 5 : 8} style={{marginRight: "46px"}}>
          <Grid container spacing={2}>
            {dialogType === "editChild" || dialogType === "addChild" ?  <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
               בחר מסלול
              </InputLabel>
               <Select
               name="week_chosen"
               value={form.week_chosen}
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
          {vacationsDates?.map((type) => (
            <MenuItem key={type} value={type.name} className={classes.selectedMenuItem}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
            </Grid> : <></>}
         
         {dialogType !== "editChild" && dialogType !== "addChild" ? <Grid item>
             <InputLabel className={classes.inputLabelStyle}>
               סכום עסקה
             </InputLabel>
             <TextField
               name="total_amount"
               value={form.total_amount}
               className={classes.textField}
               onChange={handleInputChange}
             />
           </Grid>:<></>}
        
           
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                 תאריך הגעה
              </InputLabel>
              <TextField
                type="date"
                name="arrival_date"
                value={form.arrival_date}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
               תאריך עזיבה
              </InputLabel>
              <TextField
                 type="date"
                name="departure_date"
                value={form.departure_date}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Grid>

        {handleFlightsCheckbox()}
      </Grid>

      <Grid
        item
        xs={12}
        container
        justifyContent="space-around"
        style={{marginTop:"40px"}}
      >
        <Grid item>
          <Button onClick={submit} className={classes.submitButton}>
            עדכן פרטי הזמנה
          </Button>
        </Grid>
        <Grid item>
          <Button
            className={classes.cancelButton}
            onClick={handleCloseClicked}>
            סגור
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default ReservationView;
