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
import Parent from "./Parent/Parent"
import Child from "./Child/Child"
import CreateFamily from "./CreateFamily/CreateFamily"


const GuestView = (props) => {
  const dispatch = useDispatch()
  const dialogType = useSelector(((state) => state.dialogSlice.type))
  const classes = useStyles();
  const guests = useSelector((state) => state.userSlice.guests)
  const form = useSelector((state) => state.userSlice.form)
  const {
    submit,
    areaCodes,
    handleButtonString,
    handleInputChange
  } = props;

const handleDataInputsView = () => {
  if(dialogType === "addParent" || dialogType === "editParent"){
    return <Parent areaCodes={areaCodes} handleInputChange={handleInputChange}/>
  }else if(dialogType === "addChild" || dialogType === "editChild"){
    return <Child areaCodes={areaCodes} handleInputChange={handleInputChange}/>
  }else if(dialogType === "addFamily"){
    return <CreateFamily handleInputChange={handleInputChange}/>
  }
}

  return (
    <>
      <Grid container style={{ minHeight: "340px" }}>
        {dialogType === "addChild" ? 
        <Grid item xs={12} style={{marginTop:"-40px",marginRight:"35px"}}>
          <Typography>הוסף בן משפחה</Typography>
          </Grid> : <></>}
        {handleDataInputsView()}
      </Grid>
  
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
