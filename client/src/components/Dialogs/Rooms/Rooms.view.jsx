import React, { useState,useEffect } from "react";
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
  OutlinedInput,
} from "@mui/material";
import { useStyles } from "./Rooms.style";

const RoomsView = (props) => {
  const classes = useStyles();
       const { closeModal, roomType, form, setForm,filteredOptions,userDetails,submit,rooms} = props;
console.log(form)
  return (
    <>
  <Grid container style={{ minHeight: "234px", padding: "20px" }}>
  {form.map((room, index) => (
      <Grid  item xs={12}style={{display:"flex",flexDirection:"row",justifyContent:"space-between"}}>
 {  console.log(room.roomType,"gggggggg")}
      {/* Room Type */}
      <Grid item xs={3}>
        <InputLabel className={classes.inputSelectLabelStyle}>סוג חדר {index + 1}</InputLabel>
        <Select
               value={room.roomType || ""}
                onChange={(e) =>{
                  const updatedForm = [...form];
                  updatedForm[index].roomType = e.target.value;
                  setForm(updatedForm);
                  // setForm((prevForm) => {
                  //   const updatedForm = [...prevForm];
                  //   updatedForm[index] = {
                  //     ...updatedForm[index],
                  //     roomType: e.target.value,
                  //   };
                  //   return updatedForm;
                  }}
                
                input={
                  <OutlinedInput
                  value={room.roomType || ""}
                    className={classes.selectOutline}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: "#ffffff !important",
                      bgcolor: "#222222",
                      paddinTop: "110px !important",
                    },
                  },
              }}>
                {console.log(roomType)}
          {roomType?.map((roomTypeOption) => (
            <MenuItem key={roomTypeOption} value={roomTypeOption} className={classes.selectedMenuItem}>
              {roomTypeOption}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      {/* Floor */}
      <Grid item xs={2}>
        <InputLabel className={classes.inputLabelStyle}>קומה</InputLabel>
        <Select
               value={room.floor || ""}
                  onChange={(e) => {
                    const updatedForm = [...form];
                    updatedForm[index].floor = e.target.value;
                    setForm(updatedForm);
                  }}
                input={
                  <OutlinedInput
                    value={room.floor || ""}
                    className={classes.selectOutline2}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: "#ffffff !important",
                      bgcolor: "#222222",
                      paddinTop: "110px !important",
                    },
                  },
                }}
              >
          {filteredOptions[index]?.floors?.map((floor) => (
            <MenuItem key={floor} value={floor}>
              {floor}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      {/* Size */}
      <Grid item xs={2}>
        <InputLabel className={classes.inputLabelStyle}>גודל</InputLabel>
        <Select
            value={room.size || ""}
            onChange={(e) => {
              const updatedForm = [...form];
              updatedForm[index].size = e.target.value;
              setForm(updatedForm);
            }}
                input={
                  <OutlinedInput
                  value={room.size || ""}
                    className={classes.selectOutline2}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: "#ffffff !important",
                      bgcolor: "#222222",
                      paddinTop: "110px !important",
                    },
                  },
                }}
              >
          {filteredOptions[index]?.sizes?.map((size) => (
            <MenuItem key={size} value={size} className={classes.selectedMenuItem}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      {/* Direction */}
      <Grid item xs={2}>
        <InputLabel className={classes.inputLabelStyle}>כיוון</InputLabel>
        <Select
            value={room.direction || ""}
            onChange={(e) => {
              const updatedForm = [...form];
              updatedForm[index].direction = e.target.value;
              setForm(updatedForm);
            }}
                input={
                  <OutlinedInput
                  value={room.direction || ""}
                    className={classes.selectOutline2}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: "#ffffff !important",
                      bgcolor: "#222222",
                      paddinTop: "110px !important",
                    },
                  },
                }}
              >
          {filteredOptions[index]?.directions?.map((direction) => (
            <MenuItem key={direction} value={direction}  className={classes.selectedMenuItem}>
              {direction}
            </MenuItem>
          ))}
        </Select>
      </Grid>
   
    </Grid>
  ))}
      </Grid>
      <Grid
        item
        xs={12}
        container
        tyle={{ minHeight: "100vh" }}
        justifyContent="space-around"
      >
        <Grid item style={{ marginTop: "auto", padding: "16px 0"}}>
          <Button className={classes.submitButton} onClick={submit}>בחר חדרים</Button>
        </Grid>
        <Grid item style={{ marginTop: "auto", padding: "16px 0"}}>
          <Button className={classes.cancelButton} onClick={() => closeModal()}>
            סגור
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default RoomsView;
