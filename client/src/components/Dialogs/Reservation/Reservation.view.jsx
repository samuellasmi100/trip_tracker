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
  const dialogForm = useSelector((state) => state.dialogSlice.type);
  const classes = useStyles();
  const dispatch = useDispatch();
  const { handleInputChange, submit,handleCloseClicked } = props;
   const dialogType = useSelector((state) => state.dialogSlice.type)

  const handleFlightsCheckbox = () => {
      return <Flights handleInputChange={handleInputChange}/>
  }
  console.log("user",form.user_type)
  return (
    <>
      <Grid container style={{height: "400px", padding: "20px" }}>
      {dialogType === "editParent" || dialogType === "addFamily"? 
        <Grid item xs={6}>
           <Grid container spacing={2} justifyContent="center">
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
           <Grid item>
             <InputLabel className={classes.inputLabelStyle}>
               סכום עסקה
             </InputLabel>
             <TextField
               name="total_amount"
               value={form.total_amount}
               className={classes.textField}
               onChange={handleInputChange}
             />
           </Grid>
         </Grid> 
          
         
        </Grid>
        :<></>}
        <Grid item xs={dialogType === "editParent" || dialogType === "addFamily" ? 5 : 8} style={{marginRight: "46px"}}>
          <Grid container spacing={2} >
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
