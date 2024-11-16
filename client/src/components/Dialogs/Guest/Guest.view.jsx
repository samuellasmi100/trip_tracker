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
  ListItemText,
  OutlinedInput
} from "@mui/material";
import { useStyles } from "./Guest.style";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import { Email } from "@mui/icons-material";
import "./Guest.css"

const GuestView = (props) => {
  const classes = useStyles();
  const {
    closeModal,
    setForm,
    form,
    submit,
    dialogType,
    areaCodes,
    handleButtonString
  } = props;


  return (
    <>
      <Grid container style={{ minHeight: "340px" }}>
        <Grid item xs={6}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                שם פרטי
              </InputLabel>
              <TextField
                value={form.firstName}
                className={classes.textField}
                onChange={e => setForm(prevForm => ({ ...prevForm, firstName: e.target.value }))}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                שם משפחה
              </InputLabel>
              <TextField
                value={form.lastName}
                className={classes.textField}
                onChange={e => setForm(prevForm => ({ ...prevForm, lastName: e.target.value }))}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                מספר זהות
              </InputLabel>
              <TextField
                value={form.identitId}
                className={classes.textField}
                onChange={e => setForm(prevForm => ({ ...prevForm, identitId: e.target.value }))}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>אימייל</InputLabel>
              <TextField
                value={form.email}
                className={classes.textField}
                onChange={e => setForm(prevForm => ({ ...prevForm, email: e.target.value }))}
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
                    value={form.phoneB}
                    className={classes.textFieldPhone}
                    onChange={e => setForm(prevForm => ({ ...prevForm, phoneB: e.target.value }))}

                  />
                </Grid>
                <Grid>
                  <Select
                    value={form.phoneA}
                    onChange={e => setForm(prevForm => ({ ...prevForm, phoneA: e.target.value }))}
                    input={
                      <OutlinedInput
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
            {dialogType !== "child" ?
              <>
                <Grid item>
                  <InputLabel className={classes.inputLabelStyle}>
                    כמות נופשים
                  </InputLabel>
                  <TextField
                    value={form.numberOfGuests}
                    className={classes.textField}
                    onChange={e => setForm(prevForm => ({ ...prevForm, numberOfGuests: e.target.value }))}
                  />
                </Grid>

                <Grid item>
                  <InputLabel className={classes.inputLabelStyle}>
                    כמות חדרים
                  </InputLabel>
                  <TextField
                    value={form.numberOfRooms}
                    className={classes.textField}
                    onChange={e => setForm(prevForm => ({ ...prevForm, numberOfRooms: e.target.value }))}
                  />

                </Grid>

                <Grid item>
                  <InputLabel className={classes.inputLabelStyle}>
                    סכום עסקה
                  </InputLabel>
                  <TextField
                    value={form.totalAmount}
                    className={classes.textField}
                    onChange={e => setForm(prevForm => ({ ...prevForm, totalAmount: e.target.value }))}
                  />
                </Grid> </>
              : <></>}

          </Grid>
        </Grid>
      </Grid>
      {dialogType !== "child" ?
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
                    className={classes.checkbox}
                    onClick={e => setForm(prevForm => ({ ...prevForm, includesFlight: e.target.checked }))}
                    checked={form.includesFlight}
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
          <Button className={classes.cancelButton} onClick={() => closeModal()}>
            סגור
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default GuestView;
