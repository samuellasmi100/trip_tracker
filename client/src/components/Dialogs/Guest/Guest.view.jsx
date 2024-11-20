import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  OutlinedInput
} from "@mui/material";
import { useStyles } from "./Guest.style";
import {useDispatch, useSelector } from "react-redux";
import "./Guest.css"
import * as dialogSlice from "../../../store/slice/dialogSlice"

const GuestView = (props) => {
  const dispatch = useDispatch()
  const dialogType = useSelector(((state) => state.dialogSlice.type))
  const classes = useStyles();
  const form = useSelector((state) => state.userSlice.form)
  const {
    submit,
    areaCodes,
    handleButtonString,
    handleInputChange
  } = props;


  return (
    <>
      <Grid container style={{ minHeight: "340px" }}>
        {dialogType === "addChild" ? <Grid item xs={12} style={{marginTop:"-40px",marginRight:"35px"}}><Typography>הוסף בן משפחה</Typography></Grid> : <></>}
        <Grid item xs={6}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                שם פרטי
              </InputLabel>
              <TextField
                 name="first_name"
                value={form.first_name}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                שם משפחה
              </InputLabel>
              <TextField
               name="last_name"
                value={form.last_name}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                מספר זהות
              </InputLabel>
              <TextField
               name="identity_id"
                value={form.identity_id}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>אימייל</InputLabel>
              <TextField
                name="email"
                value={form.email}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                מספר טלפון
              </InputLabel>
              <Grid container>
                <Grid style={{ paddingLeft: "10px" }}>
                  <TextField
                    name="phone_b"
                    value={form.phone_b}
                    className={classes.textFieldPhone}
                    onChange={handleInputChange}

                  />
                </Grid>
                <Grid>
                  <Select
                    name="phone_a"
                    value={form.phone_a}
                    onChange={handleInputChange}
                    input={
                      <OutlinedInput
                       name="phoneA"
                        value={form.phoneA}
                        className={classes.selectOutline}
                      />
                    }
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          color: "#ffffff !important",
                          bgcolor: "#222222",
                          paddinTop: "110px !important"
                        },
                      },
                    }}
                  >
                    {areaCodes.map((region) => (
                      <MenuItem
                        key={region}
                        value={region}
                        className={classes.selectedMenuItem}>
                        <ListItemText
                          primaryTypographyProps={{ fontSize: "16" }}
                          primary={region}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
            {dialogType !== "addChild" && dialogType !== "editChild" ?
              <>
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
                </Grid> </>
              : <></>}

          </Grid>
        </Grid>
      </Grid>
      {dialogType !== "addChild"  && dialogType !== "editChild" ?
        <Grid style={{ marginLeft: "30px" }}>
          <Grid container display="flex"
          >
            <Grid item>
              <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      color: "#686B76",
                      "&.Mui-checked": {
                        color: "#54A9FF",
                      },
                    }}
                    name="flights"
                    className={classes.checkbox}
                    onClick={handleInputChange}
                    checked={form.flights}
                  />
                }
                label={
                  <Typography style={{ color: "##757882", fontSize: "15px" }}>
                    כולל טיסות
                  </Typography>
                }
              />
            </Grid>

          </Grid>
        </Grid> : <></>}
      <Grid
        item
        xs={12}
        container
        justifyContent="space-around">
        <Grid item>
          <Button
            onClick={submit}
            className={classes.submitButton}
           >{handleButtonString()}

          </Button>
        </Grid>
        <Grid item>
          <Button className={classes.cancelButton} onClick={() =>  dispatch(dialogSlice.closeModal())}>
            סגור
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default GuestView;
