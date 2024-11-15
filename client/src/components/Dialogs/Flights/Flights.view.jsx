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


const FlightsView = (props) => {
  const classes = useStyles();

  const {
    closeModal,
    dialogOpen,
    
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
                  // value={currentClientUserData.firstName}
                  className={classes.textField}
                // onChange={(e) => changeCurrentClientUserData(e, "firstName")}
                />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                  תוקף
                </InputLabel>
                <TextField
                  // value={currentClientUserData.lastName}
                  className={classes.textField}
                // onChange={(e) => changeCurrentClientUserData(e, "lastName")}
                />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                 תאריך לידה
                </InputLabel>
                <TextField
                  // value={currentClientUserData.firstName}
                  className={classes.textField}
                // onChange={(e) => changeCurrentClientUserData(e, "firstName")}
                />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>גיל</InputLabel>
                <TextField
                  // value={currentClientUserData.email}
                  className={classes.textField}
                // onChange={(e) => changeCurrentClientUserData(e, "email")}
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
                  // value={currentClientUserData?.dailyLimit}
                  className={classes.textField}
                // onChange={(e) => changeCurrentClientUserData(e, "dailyLimit")}
                />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                 תאריך טיסה חזור
                </InputLabel>
                <TextField
                  // value={currentClientUserData?.dailyLimit}
                  className={classes.textField}
                // onChange={(e) => changeCurrentClientUserData(e, "dailyLimit")}
                />
              </Grid>
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>
                 מספר טיסה
                </InputLabel>
                <TextField
                  // value={currentClientUserData?.dailyLimit}
                  className={classes.textField}
                // onChange={(e) => changeCurrentClientUserData(e, "dailyLimit")}
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
              className={classes.submitButton}
            >צור אורח
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

export default FlightsView;
