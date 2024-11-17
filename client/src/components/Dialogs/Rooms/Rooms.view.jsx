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
  const { closeModal, roomType, form, setForm,filteredOptions } = props;


  return (
    <>
      <Grid container style={{ minHeight: "350px", padding: "20px" }}>
        <Grid item xs={6}>
          <Grid container style={{display:"flex",flexDirection:"column"}} spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <InputLabel className={classes.inputSelectLabelStyle}>
                סוג חדר
              </InputLabel>
              <Select
                value={form.roomType}
                onChange={(e) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    roomType: e.target.value,
                  }))
                }
                input={
                  <OutlinedInput
                    value={form.roomType}
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
                }}
              >
                {roomType.map((room) => (
                  <MenuItem
                    key={room}
                    value={room}
                    className={classes.selectedMenuItem}
                  >
                    <ListItemText
                      primaryTypographyProps={{ fontSize: "14px" }}
                      primary={room}
                    />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item  xs={6}>
              <InputLabel className={classes.inputLabelStyle}>קומה</InputLabel>
              <Select
                value={form.floor}
                onChange={(e) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    floor: e.target.value,
                  }))
                }
                input={
                  <OutlinedInput
                    value={form.roomType}
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
                }}
              >
                {filteredOptions?.floors?.map((room) => (
                  <MenuItem
                    key={room}
                    value={room}
                    className={classes.selectedMenuItem}
                  >
                    <ListItemText
                      primaryTypographyProps={{ fontSize: "14px" }}
                      primary={room}
                    />
                  </MenuItem>
                ))}
              </Select>
            </Grid>




            <Grid item  xs={6}>
              <InputLabel className={classes.inputLabelStyle}>גודל</InputLabel>
              <Select
                value={form.size}
                onChange={(e) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    size: e.target.value,
                  }))
                }
                input={
                  <OutlinedInput
                    value={form.roomType}
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
                }}
              >
                {filteredOptions?.sizes?.map((room) => (
                  <MenuItem
                    key={room}
                    value={room}
                    className={classes.selectedMenuItem}
                  >
                    <ListItemText
                      primaryTypographyProps={{ fontSize: "14px" }}
                      primary={room}
                    />
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={6}>
              <InputLabel className={classes.inputLabelStyle}>קומה</InputLabel>
              <Select
                value={form.direction}
                onChange={(e) =>
                  setForm((prevForm) => ({
                    ...prevForm,
                    direction: e.target.value,
                  }))
                }
                input={
                  <OutlinedInput
                    value={form.roomType}
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
                }}
              >
                {filteredOptions?.directions?.map((room) => (
                  <MenuItem
                    key={room}
                    value={room}
                    className={classes.selectedMenuItem}
                  >
                    <ListItemText
                      primaryTypographyProps={{ fontSize: "14px" }}
                      primary={room}
                    />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={5}></Grid>
      </Grid>

      <Grid
        item
        xs={12}
        container
        style={{ marginTop: "30px" }}
        justifyContent="space-around"
      >
        <Grid item>
          <Button className={classes.submitButton}>צור אורח</Button>
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

export default RoomsView;
