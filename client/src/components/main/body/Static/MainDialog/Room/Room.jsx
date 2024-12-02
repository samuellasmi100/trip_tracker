import React, { useState } from "react";
import RoomView from "./Room.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice"
import * as roomsSlice from "../../../../../../store/slice/roomsSlice"
import { useSelector,useDispatch } from "react-redux";
import ApiRooms from "../../../../../../apis/roomsRequest"
const Room = (props) => {
const dispatch = useDispatch()
 const form = useSelector((state) => state.staticSlice.form)
const token = sessionStorage.getItem("token")

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(name)
    dispatch(staticSlice.updateFormField({ field: name, value }));

  };

  const submit = async() => {
  try {
    const response = await ApiRooms.updateRoom(token,form)
 
    dispatch(roomsSlice.updateRoomsList(response.data))
    dispatch(staticSlice.resetState())
  } catch (error) {
    console.log(error)
  }
  } 
  return <RoomView handleInputChange={handleInputChange} submit={submit}/>;
};

export default Room;
