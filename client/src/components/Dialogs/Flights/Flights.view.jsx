import React ,{useState} from "react";
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
} from "@mui/material";
import { useStyles } from "./Flights.style";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import * as dialogSlice from "../../../store/slice/dialogSlice"

import "./Flights.css"

const FlightsView = (props) => {
  const classes = useStyles();
  const form = useSelector((state) => state.flightsSlice.form)
  const dispatch = useDispatch()
  const {
    closeModal,
    handleInputChange,
    submit
  } = props;

 
      return (
        <>
        <Grid container  style={{ minHeight: "350px", padding: "20px" }}>
          <Grid item xs={6}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                  מספר דרכון
                </InputLabel>
                <TextField
                  name="passportNumber"
                  value={form.passportNumber}
                  className={classes.textField}
                  onChange={handleInputChange}                
                  />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                  תוקף
                </InputLabel>
                <TextField
                  type="date"
                  name="validityPassport"
                  value={form.validityPassport}
                  className={classes.textField}
                  onChange={handleInputChange}    
                />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                 תאריך לידה
                </InputLabel>
                <TextField
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  className={classes.textField}
                  onChange={handleInputChange}    
                />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>גיל</InputLabel>
                <TextField
                 name="age"
                  value={form.age}
                  className={classes.textField} 
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={5}>
            <Grid container spacing={2} justifyContent="center">
            <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                 תאריך טיסה הלוך
                </InputLabel>
                <TextField
                  type="date"
                  name="outboundFlightDate"
                  value={form?.outboundFlightDate}
                  className={classes.textField}
                  onChange={handleInputChange}    
                />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                 תאריך טיסה חזור
                </InputLabel>
                <TextField
                  type="date"
                  name="returnFlightDate"
                  value={form?.returnFlightDate}
                  className={classes.textField}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                 מספר טיסה
                </InputLabel>
                <TextField
                  name="flightNumber"
                  value={form?.flightNumber}
                  className={classes.textField}
                  onChange={handleInputChange}    
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      
        <Grid
          item
          xs={12}
          container
          style={{ marginTop: "30px" }}
          justifyContent="space-around">
          <Grid item>
            <Button
            onClick={submit}
              className={classes.submitButton}
            >עדכן פרטי טיסה

            </Button>
          </Grid>
          <Grid item>
            <Button className={classes.cancelButton} onClick={() => dispatch(dialogSlice.closeModal())}>
              סגור
            </Button>
          </Grid>
        </Grid>
      </>
  );
};

export default FlightsView;
