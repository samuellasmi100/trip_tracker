import React, { useState } from "react";
import {
  Button,
  Grid,
  InputLabel,
  Typography,
  TextField,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  FormControlLabel,
  Collapse
} from "@mui/material";
import { useStyles } from "./RoomaAssigner.style";
import { useSelector, useDispatch } from "react-redux";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import DeleteIcon from '@mui/icons-material/Delete'


const RoomsAssigner = ({ 
  submit, 
  handleDeleteButton,
  searchTerm,
  setSearchTerm,
  isListOpen,
  setIsListOpen,
  roomsChosen,
  filteredRooms,
  handleRoomToggle,
  handleCloseClicked
 }) => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedRooms = useSelector((state) => state.roomsSlice.selectedRooms);

const handleMouseLeave = () => {
  setIsListOpen(false)
  setSearchTerm("")
}

  return (
    <>
      <Grid style={{ padding: "20px"}}>
        <Grid item style={{ marginTop: "-10px" }}>
          <Typography>
             בעבור אורח זה אנא בחר עוד: {roomsChosen} חדרים
          </Typography>
        </Grid>
        <Grid item xs={12}>  
           <TextField
              className={classes.textField}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              // onMouseEnter={() => setIsListOpen(true)}
              // onMouseLeave={handleMouseLeave}
            />
           
          </Grid>
          <Grid item xs={12} style={{position:'relative'}}> 
          <List 
            // onMouseEnter={() => setIsListOpen(true)}
            // onMouseLeave={handleMouseLeave}
            style={{
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
                borderRadius: '4px',
                width: '2px',
                height: '6px'
              },
              '& li:hover': {
                background: '#babec7'
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
              checked={selectedRooms.some((r) => r.rooms_id === room.rooms_id)}
            />
            <ListItemText
             style={{}}
              primary={room.rooms_id}
            />
          </ListItem>
        ))}
          </List>
          </Grid>
          {selectedRooms?.map((room) => {
            return(
              <>
            <Grid item container
              xs={12}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                filter: isListOpen ? "blur(5px)" : "none", 
                transition: "filter 0.3s ease" 
              }}>
             <Grid item>

             <IconButton
              onClick={() =>
               handleDeleteButton(room.rooms_id)
              }>
              <DeleteIcon className={classes.delete}/>
              </IconButton>
            
              </Grid>   
            <Grid item>
             <InputLabel className={classes.inputSelectLabelStyle}>
              חדר
             </InputLabel>
             <TextField
                name="roomId"
                value={room.rooms_id}
               className={classes.shortTextField2}
             />
           </Grid>
              <Grid item>
              <InputLabel className={classes.inputSelectLabelStyle}>
                סוג חדר
              </InputLabel>
              <TextField
                 name="type"
                 value={room.type}
                className={classes.textField}
              />
            </Grid>
             <Grid item >
             <InputLabel className={classes.inputSelectLabelStyle}>
               קומה
             </InputLabel>
             <TextField
                name="floor"
                value={room.floor}
               className={classes.shortTextField2}
             />
           </Grid>
           
           <Grid item >
             <InputLabel className={classes.inputSelectLabelStyle}>
               גודל
             </InputLabel>
             <TextField
                name="size"
                value={room.size}
               className={classes.shortTextField2}
             />
           </Grid>
           <Grid item >
             <InputLabel className={classes.inputSelectLabelStyle}>
               כיוון
             </InputLabel>
             <TextField
                name="direction"
                value={room.direction}
               className={classes.shortTextField}
             />
           </Grid>
           </Grid>
                </>
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
            onClick={handleCloseClicked}
          >
            סגור
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default RoomsAssigner;
