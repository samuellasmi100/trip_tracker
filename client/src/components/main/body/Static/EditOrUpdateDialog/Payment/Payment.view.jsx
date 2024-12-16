import {
    Grid,
    TextField,
    InputLabel,
    Button
  } from "@mui/material";
  import { useStyles } from "./Payment.style";
  import React from "react";
  import { useSelector,useDispatch } from "react-redux";

  
  function PaymentView({submit,handleInputChange,handleCloseClicked}) {
    const classes = useStyles();
    const form = useSelector((state) => state.staticSlice.form)
  
    return (
    <Grid container>
     <Grid
          item
          container
          xs={12}
          style={{ marginLeft: "30px"}}     
          alignContent="center"
          justifyContent="space-between">
          <Grid item xs={12} container justifyContent="center" style={{ marginBottom: "30px" }}>
             פירוט תשלומים
          </Grid>
  
        </Grid>
        <Grid item xs={12}>
          <Grid container justifyContent="center" style={{gap:'7px'}}>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                 התקבל
              </InputLabel>
              <TextField
                name=" rooms_id"
                className={classes.textField}
                value={form?. rooms_id}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                 בתאריך
              </InputLabel>
              <TextField
                name="floor"
                value={ form?.floor}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                מטבע תשלום
              </InputLabel>
              <TextField
                name="floor"
                value={ form?.floor}
                className={classes.textField}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                 צורת תשלום
              </InputLabel>
              <TextField
              name="size"
              value={ form?.size}
              className={classes.textField}
              onChange={handleInputChange}
              />
            </Grid>
           
          </Grid>
        </Grid>
     
        <Grid
          item
          xs={12}
          container
          style={{ marginTop: "300px" }}
          justifyContent="space-around">
          <Grid item>
            <Button
            onClick={submit}
              className={classes.submitButton}
            >  עדכן תשלומים 
  
            </Button>
          </Grid>
          <Grid item>
            <Button className={classes.cancelButton} onClick={handleCloseClicked}>
              סגור
            </Button>
          </Grid>
        </Grid>
    </Grid>
    )
  }
  
  export default PaymentView;
  