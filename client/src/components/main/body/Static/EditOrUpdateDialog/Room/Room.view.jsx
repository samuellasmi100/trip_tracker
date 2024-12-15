import {
  Grid,
  TextField,
  InputLabel,
  Button
} from "@mui/material";
import { useStyles } from "./Room.style";
import React from "react";
import { useSelector,useDispatch } from "react-redux";
import * as staticSlice from "../../../../../../store/slice/staticSlice"

function RoomView({submit,handleInputChange,handleCloseClicked}) {
  const dispatch = useDispatch()
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
              value={form?. rooms_id}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              קומה
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
               גודל
            </InputLabel>
            <TextField
            name="size"
            value={ form?.size}
            className={classes.textField}
            onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>כיוון</InputLabel>
            <TextField
                 name="direction"
                 value={ form?.direction}
                 className={classes.textField}
                 onChange={handleInputChange}
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
                value={ form?.type}
                className={classes.textField}
                onChange={handleInputChange}
            />
          </Grid>
        <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
                 אורחים בחדר
            </InputLabel>
            <TextField
              name="base_occupancy"
              className={classes.textField}
             value={ form?.base_occupancy}
             onChange={handleInputChange}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
                אורחים נוספים 
            </InputLabel>
            <TextField
               name="max_occupancy"
               className={classes.textField}
              value={ form?.max_occupancy}
              onChange={handleInputChange}
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
          <Button className={classes.cancelButton} onClick={handleCloseClicked}>
            סגור
          </Button>
        </Grid>
      </Grid>
  </Grid>
  )
}

export default RoomView;
