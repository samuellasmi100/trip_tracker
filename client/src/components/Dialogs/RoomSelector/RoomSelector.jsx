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
  const form = useSelector((state) => state.userSlice.form);
  const [roomChossenType, setRoomChossenType] = useState()
  const guests = useSelector((state) => state.userSlice.guests);
  const [names, setNames] = useState( guests.map((key) => {
    return {userId:key.user_id,name:key.hebrew_name,family_id:key.family_id}
  }));
 const [guestsRoomList, setGuestsRoomList] = useState([])


  
  const handleUserCheckboxChange = async(e,userId, roomId, familyId) => {
   let status = e.target.checked
    let dataTosend = {userId, roomId, familyId,status}
   try {
    let response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/room/parent`, { dataTosend })
   } catch (error) {
    console.log(error)
   }
  };


  const submit = async () => {
    try {
      let response
      if(form.user_type === ""){

      }else {
        if(roomChossenType){
          response = await axios.put(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/room`, { selectedChildRoomId, form })
        }else {
            response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/room`, { selectedChildRoomId, form })
        }
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
      let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/${familyId}`)
      setGuestsRoomList(response.data.userAssignRoom)
      dispatch(roomsSlice.updateSelectedRoomsList(response.data.familyRooms))
    } catch (error) {
      console.log(error)
    }
  }

  const getChossenRoom = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/room/${form.user_id}`)
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
      names={names}
      handleUserCheckboxChange={handleUserCheckboxChange}
      guestsRoomList={guestsRoomList}
    />
  );
};

export default RoomSelector;
