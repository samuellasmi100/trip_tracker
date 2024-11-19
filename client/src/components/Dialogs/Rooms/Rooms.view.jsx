import React, { useState } from "react";
import {
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox
} from "@mui/material";
import { useStyles } from "./Rooms.style";
import { useSelector, useDispatch } from "react-redux";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import * as roomsSlice from "../../../store/slice/roomsSlice";
import * as userSlice from "../../../store/slice/userSlice";
import * as snackbarSlice from "../../../store/slice/snackbarSlice";

const RoomsView = ({ 
  submit, 
  handleInputChange,
  searchTerm,
  setSearchTerm,
  isListOpen,
  setIsListOpen,
  roomsChosen,
  filteredRooms,
  handleRoomToggle,
 }) => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedRooms = useSelector((state) => state.roomsSlice.selectedRooms);

  return (
    <>
      <Grid style={{ padding: "20px"}} 
      >
        <Grid item style={{ marginTop: "-10px" }}>
          <Typography>
             בעבור אורח זה אנא בחר עוד: {roomsChosen} חדרים
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ }}>
            <TextField
              className={classes.textField}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              onMouseEnter={() => setIsListOpen(true)}
              onMouseLeave={() => setIsListOpen(false)}
            />
           
          </Grid>
          <Grid item xs={12} style={{position:'relative'}}> 
          <List style={{
            maxHeight:"260px",
            overflow:"auto", 
            width:"151px",
            borderRadius:"4px",
             position: "absolute", 
             boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", 
             maxHeight: "260px", 
             overflowY: "auto",
          }}
             sx={{
              '&::-webkit-scrollbar': {
                width: '4px',
                height: '20px'
              },
              '&::-webkit-scrollbar-track': {
                background: '#babec7',
                width: '2px',
                height: '2px'
              },
              '&::-webkit-scrollbar-thumb': {
                background: '#707079',
                // background: theme.palette.svg.clearIcon,
                borderRadius: '4px',
                width: '2px',
                height: '6px'
              },
              '& li:hover': {
                background: '#babec7'
                // backgroundColor: theme.palette.modal.primary
              }
            }}
          >

        {filteredRooms.map((room) => (
          <ListItem
          style={{height:"50px",marginTop:"1px"}}
            key={room.roomId}
            onClick={() => handleRoomToggle(room)}
          >
            <Checkbox
              style={{color:"white"}}
              checked={selectedRooms.some((r) => r.roomId === room.roomId)}
            />
            <ListItemText
             style={{}}
              primary={room.roomId}
            />
          </ListItem>
        ))}
          </List>
          </Grid>
          {selectedRooms?.map((room) => {
            return(
            <Grid item container
              xs={12}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                filter: isListOpen ? "blur(5px)" : "none", 
                transition: "filter 0.3s ease" 
              }}>
            <Grid item >
             <InputLabel className={classes.inputSelectLabelStyle}>
              חדר
             </InputLabel>
             <TextField
                name="roomId"
                value={room.roomId}
               className={classes.shortTextField2}
             />
           </Grid>
              <Grid item>
              <InputLabel className={classes.inputSelectLabelStyle}>
                סוג חדר
              </InputLabel>
              <TextField
                 name="roomType"
                 value={room.roomType}
                className={classes.textField}
              />
            </Grid>
             <Grid item >
             <InputLabel className={classes.inputSelectLabelStyle}>
               קומה
             </InputLabel>
             <TextField
                name="roomType"
                value={room.roomFloor}
               className={classes.shortTextField}
             />
           </Grid>
           <Grid item >
             <InputLabel className={classes.inputSelectLabelStyle}>
               גודל
             </InputLabel>
             <TextField
                name="size"
                value={room.roomSize}
               className={classes.shortTextField}
             />
           </Grid>
           <Grid item >
             <InputLabel className={classes.inputSelectLabelStyle}>
               כיוון
             </InputLabel>
             <TextField
                name="direction"
                value={room.roomDirection}
               className={classes.shortTextField}

             />
           </Grid>
           </Grid>
            )
          })}
      </Grid>
      <Grid item  xs={12} container justifyContent="space-around">
        <Grid item style={{ marginTop: "auto", padding: "16px 0" }}>
          <Button className={classes.submitButton} onClick={submit}>
            בחר חדרים
          </Button>
        </Grid>
        <Grid item style={{ marginTop: "auto", padding: "16px 0" }}>
          <Button
            className={classes.cancelButton}
            onClick={() => dispatch(dialogSlice.closeModal())}
          >
            סגור
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default RoomsView;
