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
} from "@mui/material";
import { useStyles } from "./Flights.style";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import * as dialogSlice from "../../../store/slice/dialogSlice"

import "./Flights.css"

const FlightsView = (props) => {
  const classes = useStyles();
  const form = useSelector((state) => state.flightsSlice.form)
  const parentDetails = useSelector((state) => state.userSlice.parent)
  const userForm = useSelector((state) => state.userSlice.form)


  const handleFligthsInputsView = () => {
    if (userForm?.flights_direction === "round_trip") {
      return (
        <>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              תאריך טיסה חזור
            </InputLabel>
            <TextField
              type="date"
              name="return_flight_date"
              value={form?.return_flight_date}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              מספר טיסה הלוך
            </InputLabel>
            <TextField
              name="outbound_flight_number"
              value={form?.outbound_flight_number}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              מספר טיסה חזור
            </InputLabel>
            <TextField
              name="return_flight_number"
              value={form?.return_flight_number}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              חברת תעופה הלוך
            </InputLabel>
            <TextField
              name="outbound_airline"
              value={form?.outbound_airline}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              חברת תעופה חזור
            </InputLabel>
            <TextField
              name="return_airline"
              value={form?.return_airline}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>

        </>
      )
    } else if (userForm?.flights_direction === "one_way_return") {
      return (
        <>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              תאריך טיסה חזור
            </InputLabel>
            <TextField
              type="date"
              name="return_flight_date"
              value={form?.return_flight_date}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              מספר טיסה חזור
            </InputLabel>
            <TextField
              name="return_flight_number"
              value={form?.return_flight_number}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              חברת תעופה חזור
            </InputLabel>
            <TextField
              name="return_airline"
              value={form?.return_airline}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>
        </>
      )
    } else if (userForm?.flights_direction === "one_way_outbound") {
      return (
        <>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              תאריך טיסה הלוך
            </InputLabel>
            <TextField
              type="date"
              name="outbound_flight_date"
              value={form?.outbound_flight_date}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              מספר טיסה הלוך
            </InputLabel>
            <TextField
              name="outbound_flight_number"
              value={form?.outbound_flight_number}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              חברת תעופה הלוך
            </InputLabel>
            <TextField
              name="outbound_airline"
              value={form?.outbound_airline}
              className={classes.textField}
              onChange={handleInputChange}
            />
          </Grid>
        </>
      )
    }
  }

  const dispatch = useDispatch()
  const {
    handleInputChange,
    submit
  } = props;


  return (
    <>
      <Grid container style={{ minHeight: "350px", padding: "20px" }}>
        <Grid item xs={6}>
          <Grid container spacing={1} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                מספר דרכון
              </InputLabel>
              <TextField
                name="passport_number"
                value={form.passport_number}
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
                name="validity_passport"
                value={form.validity_passport}
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
                name="birth_date"
                value={form.birth_date}
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
            {userForm.flights_direction === "round_trip" ?
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                  תאריך טיסה הלוך
                </InputLabel>
                <TextField
                  type="date"
                  name="outbound_flight_date"
                  value={form?.outbound_flight_date}
                  className={classes.textField}
                  onChange={handleInputChange}
                />
              </Grid> : ""}
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={1} justifyContent="center">
            {handleFligthsInputsView()}
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
