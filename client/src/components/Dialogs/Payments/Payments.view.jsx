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
import { useStyles } from "./Payments.style";


const PaymentsView = (props) => {
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
                סכום עסקה
              </InputLabel>
              <TextField
                value={100}
                className={classes.textField}
              // onChange={(e) => changeCurrentClientUserData(e, "firstName")}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                סכום תקבול
              </InputLabel>
              <TextField
                // value={currentClientUserData.lastName}
                className={classes.textField}
              // onChange={(e) => changeCurrentClientUserData(e, "lastName")}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
               תאריך תשלום
              </InputLabel>
              <TextField
                // value={currentClientUserData.firstName}
                className={classes.textField}
              // onChange={(e) => changeCurrentClientUserData(e, "firstName")}
              />
            </Grid>
           
          </Grid>
        </Grid>
        <Grid item xs={5}>
        <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
              צורת תשלום
              </InputLabel>
              <TextField
                // value={currentClientUserData.firstName}
                className={classes.textField}
              // onChange={(e) => changeCurrentClientUserData(e, "firstName")}
              />
            </Grid>
        <Grid item>
              <InputLabel className={classes.inputLabelStyle}>נותר לתשלום</InputLabel>
              <TextField
                // value={currentClientUserData.email}
                className={classes.textField}
              // onChange={(e) => changeCurrentClientUserData(e, "email")}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>מטבע תשלום</InputLabel>
              <TextField
                // value={currentClientUserData.email}
                className={classes.textField}
              // onChange={(e) => changeCurrentClientUserData(e, "email")}
              />
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

export default PaymentsView;
