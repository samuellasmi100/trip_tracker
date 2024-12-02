import {
    Grid,
    TextField,
    InputLabel,
    Button
  } from "@mui/material";
import { useStyles } from "./Room.style";
import React, { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import * as staticSlice from "../../../../../../store/slice/staticSlice"
  
  function RoomView({submit}) {
    const dispatch = useDispatch()
    const classes = useStyles();
    const  roomDetails = useSelector((state) => state.staticSlice. roomDetails)

    return (
    <Grid container>
     <Grid
          item
          container
          xs={12}
          style={{ marginTop: "30px", marginLeft: "30px"}}     
          alignContent="center"
          justifyContent="space-between">
          <Grid item xs={12} container justifyContent="center" style={{ marginTop: "20px", marginBottom: "30px" }}>
            עדכן חדר
          </Grid>

        </Grid>
        <Grid item xs={6}>
          <Grid container spacing={1} justifyContent="center">
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                מספר חדר
              </InputLabel>
              <TextField
                name=" rooms_id"
                className={classes.textField}
                value={ roomDetails?. rooms_id}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                קומה
              </InputLabel>
              <TextField
                name="floor"
                value={ roomDetails?.floor}
                className={classes.textField}

              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                 גודל
              </InputLabel>
              <TextField
              name="size"
              value={ roomDetails?.size}
              className={classes.textField}

              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>כיוון</InputLabel>
              <TextField
                   name="direction"
                   value={ roomDetails?.direction}
                   className={classes.textField}
              />
            </Grid>
           
          </Grid>
        </Grid>
        <Grid item xs={5}>
    
          <Grid container spacing={1} justifyContent="center">
          <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                 סוג חדר
              </InputLabel>
              <TextField
                  name="type"
                  value={ roomDetails?.type}
                  className={classes.textField}

              />
            </Grid>
          <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                   אורחים בחדר
              </InputLabel>
              <TextField
                name="base_occupancy"
                className={classes.textField}
               value={ roomDetails?.base_occupancy}
              />
            </Grid>
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>
                  אורחים נוספים 
              </InputLabel>
              <TextField
                 name="max_occupancy"
                 className={classes.textField}
                value={ roomDetails?.max_occupancy}
              />
            </Grid>
            
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          container
          style={{ marginTop: "150px" }}
          justifyContent="space-around">
          <Grid item>
            <Button
            onClick={submit}
              className={classes.submitButton}
            >  עדכן חדר 

            </Button>
          </Grid>
          <Grid item>
            <Button className={classes.cancelButton} onClick={() => dispatch(staticSlice.closeModal())}>
              סגור
            </Button>
          </Grid>
        </Grid>
    </Grid>
    )
  }
  
  export default RoomView;
  