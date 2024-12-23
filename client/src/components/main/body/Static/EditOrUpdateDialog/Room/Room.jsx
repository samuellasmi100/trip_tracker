import React, { useState } from "react";
import RoomView from "./Room.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice"
import * as roomsSlice from "../../../../../../store/slice/roomsSlice"
import { useSelector, useDispatch } from "react-redux";
import ApiRooms from "../../../../../../apis/roomsRequest"


const Room = () => {
  const dispatch = useDispatch()
  const form = useSelector((state) => state.staticSlice.form)
  const token = sessionStorage.getItem("token")
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if(name === "max_occupancy"){
      dispatch(staticSlice.updateFormField({ field: name, value }));
    }else {
      return
    }
  };

  const submit = async () => {
    try {
      const response = await ApiRooms.updateRoom(token,form,vacationId)
      dispatch(roomsSlice.updateRoomsList(response.data));
      dispatch(staticSlice.closeDetailsModal());
    } catch (error) {
      console.log(error)
    }
  }
  const handleCloseClicked = () => {
    dispatch(staticSlice.resetState())
    dispatch(staticSlice.closeDetailsModal());
   }

  return <RoomView handleInputChange={handleInputChange} submit={submit} handleCloseClicked={handleCloseClicked}/>;
};

export default Room;