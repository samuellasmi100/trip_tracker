import React, { useEffect, useState } from "react";
import RoomsView from "./RoomSelector.view"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as roomsSlice from "../../../store/slice/roomsSlice"
import * as snackbarSlice from "../../../store/slice/snackbarSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"


const RoomSelector = () => {
  const dispatch = useDispatch()
  const rooms = useSelector((state) => state.roomsSlice.rooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const activeButton = useSelector((state) => state.dialogSlice.activeButton);
  const selectedChildRoomId = useSelector((state) => state.roomsSlice.selectedChildRoomId);
  const form = useSelector((state) => state.userSlice.form)
  const selectedRooms = useSelector((state) => state.roomsSlice.selectedRooms);
  const [roomChossenType, setRoomChossenType] = useState()

  const submit = async () => {
    try {
      let response
      if(roomChossenType){
        response = await axios.put("http://localhost:5000/rooms/room", { selectedChildRoomId, form })
      }else {
        response = await axios.post("http://localhost:5000/rooms/room", { selectedChildRoomId, form })
      }

      dispatch(roomsSlice.resetChildRoom())
      dispatch(dialogSlice.closeModal())
      dispatch(roomsSlice.resetForm())
      dispatch(dialogSlice.initialActiveButton())
      dispatch(dialogSlice.initialDialogType())

    } catch (error) {
      dispatch(
        snackbarSlice.setSnackBar({
          type: "error",
          message: "נתקלנו בבעיה",
          timeout: 3000,
        })
      )
      console.log(error)
    }
  }

  const handleCheckboxChange = (roomId) => {
    dispatch(roomsSlice.updateChossenRoom(Number(selectedChildRoomId === roomId) ? null : Number(roomId)));
    dispatch(roomsSlice.toggleExpandRoom(roomId));
  }

  const getFamilyRooms = async () => {
    try {
      let familyId = form.family_id
      let response = await axios.get(`http://localhost:5000/rooms/${familyId}`)
      dispatch(roomsSlice.updateSelectedRoomsList(response.data))
    } catch (error) {
      console.log(error)
    }
  }

  const getChossenRoom = async () => {
    try {
      let response = await axios.get(`http://localhost:5000/rooms/room/${form.user_id}`)
      if(response.data.length > 0){
        setRoomChossenType(true)
        dispatch(roomsSlice.updateChossenRoom(response.data[0].roomId));
      }else {
        setRoomChossenType(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const filteredRooms = rooms?.filter((room) => {
    if (searchTerm !== "") {
      return room.roomId.includes(searchTerm)
    }
  }
  );



  useEffect(() => {
    getFamilyRooms()
    getChossenRoom()
  }, [activeButton])

  return (
    <RoomsView
      submit={submit}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      isListOpen={isListOpen}
      setIsListOpen={setIsListOpen}
      filteredRooms={filteredRooms}
      handleCheckboxChange={handleCheckboxChange}
    />
  );
};

export default RoomSelector;
