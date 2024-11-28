import React, { useState } from "react";
import {
  Button,
  Grid,
  InputLabel,
  Typography,
  TextField,
  List,
  Checkbox,
  FormControlLabel,
  Collapse,
} from "@mui/material";
import { useStyles } from "./RoomSelector.style";
import { useSelector, useDispatch } from "react-redux";
import * as dialogSlice from "../../../store/slice/dialogSlice";


const RoomSelector = ({
  submit,
  handleCheckboxChange,
  names,
  selectedRoomList,
  handleUserCheckboxChange,
  guestsRoomList
}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const selectedRooms = useSelector((state) => state.roomsSlice.selectedRooms);
  const userForm = useSelector((state) => state.userSlice.form);
  const expandedRoomId = useSelector(
    (state) => state.roomsSlice.expandedRoomId
  );

  return (
    <>
      <Grid style={{ padding: "20px" }}>
        <Grid item style={{ marginTop: "-20px", marginBottom: "8px" }}>
          <Typography>בחר חדר עבור משתמש זה</Typography>
        </Grid>

        <Grid item xs={12} style={{ position: "relative" }}>
          <List
            // onMouseEnter={() => setIsListOpen(true)}
            style={{
              maxHeight: "260px",
              overflow: "auto",
              width: "151px",
              borderRadius: "4px",
              position: "absolute",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              maxHeight: "260px",
              overflowY: "auto",
            }}
            sx={{
              "&::-webkit-scrollbar": {
                width: "4px",
                height: "20px",
              },
              "&::-webkit-scrollbar-track": {
                background: "#babec7",
                width: "2px",
                height: "2px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "#707079",
                borderRadius: "4px",
                width: "2px",
                height: "6px",
              },
              "& li:hover": {
                background: "#babec7",
              },
            }}
          ></List>
        </Grid>
        {selectedRooms?.map((room) => {
          return (
            <>
              <Grid
                item
                container
                xs={12}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // filter: isListOpen ? "blur(5px)" : "none",
                  // transition: "filter 0.3s ease"
                }}
              >
                <Grid item>
                  <FormControlLabel
                    style={{ marginTop: "18px", marginRight: "-12px" }}
                    control={
                      <Checkbox
                        sx={{
                          color: "#686B76",
                          "&.Mui-checked": {
                            color: "#54A9FF",
                          },
                        }}
                        name="flights_direction"
                        value="one_way_return"
                        checked={expandedRoomId === room.roomId}
                        onChange={() => handleCheckboxChange(room.roomId)}
                      />
                    }
                  />
                </Grid>
                <Grid item>
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
                <Grid item>
                  <InputLabel className={classes.inputSelectLabelStyle}>
                    קומה
                  </InputLabel>
                  <TextField
                    name="roomType"
                    value={room.roomFloor}
                    className={classes.shortTextField2}
                  />
                </Grid>

                <Grid item>
                  <InputLabel className={classes.inputSelectLabelStyle}>
                    גודל
                  </InputLabel>
                  <TextField
                    name="size"
                    value={room.roomSize}
                    className={classes.shortTextField2}
                  />
                </Grid>
                <Grid item>
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
              <Collapse
                in={expandedRoomId === room.roomId}
                timeout="auto"
                unmountOnExit
              >

                <Grid
                  style={{

                    border: "1px solid #494C55",
                    marginTop: "10px",
                    marginBottom: "10px",
                    borderRadius: "8px",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "10px",
                  }}
                >
                  {userForm.user_type === "parent" ? <>
                  
                    {names.map((key, index) => (
                   
                      <Grid
                        key={index}
                        style={{
                          display: "flex",
                          height: "60px",
                        }}
                      >
                           
                        <FormControlLabel
                          style={{ marginBottom: "21px", marginRight: "5px" }}
                          control={
                            <Checkbox
                              sx={{
                                color: "#686B76",
                                "&.Mui-checked": {
                                  color: "#54A9FF",
                                },
                              }}
                              checked={guestsRoomList.some(
                                (item) =>
                                  item.userId === key.userId &&
                                  item.roomId === room.roomId && 
                                  item.family_id === key.family_id
                              )}
                              onChange={(e) =>
                                handleUserCheckboxChange(e,key.userId, room.roomId, key.family_id)
                              }
                            />
                          }
                        />
                        <Typography style={{ marginRight: "4px", marginTop: "6px", whiteSpace: 'nowrap', }}>{key.name}</Typography>
                      </Grid>
                    ))}
                  </> : <Typography>
                    חדר זה מכיל {room.base_occupancy} מיטות || מיטות פנויות:{" "}
                    {room.base_occupancy - room.peopleCount}{" "}
                  </Typography>}


                </Grid>
              </Collapse>
            </>
          );
        })}
      </Grid>
      <Grid item xs={12} container justifyContent="space-around">
        <Grid item style={{ marginTop: "auto", padding: "26px 0" }}>
          <Button className={classes.submitButton} onClick={submit}>
            בחר חדרים
          </Button>
        </Grid>
        <Grid item style={{ marginTop: "auto", padding: "26px 0" }}>
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

export default RoomSelector;
{/* <Typography>
חדר זה מכיל {room.base_occupancy} מיטות || מיטות פנויות:{" "}
{room.base_occupancy - room.peopleCount}{" "}
</Typography> */}