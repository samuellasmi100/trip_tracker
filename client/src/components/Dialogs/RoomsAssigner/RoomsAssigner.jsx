import React, { useEffect,useState } from "react";
import RoomsView from "./RoomsAssigner.view"
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as roomsSlice from "../../../store/slice/roomsSlice"
import * as snackbarSlice from "../../../store/slice/snackbarSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"

const RoomsAssigner = () => {
  const dispatch = useDispatch()
  const form = useSelector((state) => state.userSlice.form)
  const rooms = useSelector((state) => state.roomsSlice.rooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const selectedRooms = useSelector((state) => state.roomsSlice.selectedRooms);
  let roomsChosen = Number(form?.number_of_rooms) - selectedRooms.length
 
   const submit = async () => {
      try {
        let familyId = form.family_id
        let response = await axios.post(`${process.env.REACT_APP_SERVER_BASE_URL}/room`,{selectedRooms,familyId})    
        dispatch(
          snackbarSlice.setSnackBar({
            type: "success",
            message: response.data,
            timeout: 3000,
          })
        )
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

   const getFamilyRooms = async () => {
    try {
      let familyId = form.family_id
      let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms/${familyId}`)  
      
      dispatch(roomsSlice.updateSelectedRoomsList(response.data.familyRooms))
    } catch (error) {
      console.log(error)
    }
  }

   const getAllRooms = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/rooms`)
      dispatch(roomsSlice.updateRoomsList(response.data))
    } catch (error) {
      console.log(error)
    }
   }

  const filteredRooms = rooms?.filter((room) =>{
    if(searchTerm !== ""){
      return room.roomId.includes(searchTerm)
    }
  } 
  );

  const handleRoomToggle = (room) => {
    const isSelected = selectedRooms.some((r) => Number(r.roomId) === Number(room.roomId));
    if (isSelected) {
      dispatch(roomsSlice.removeRoomFromForm({ roomId: room.roomId }));
    } else {
      if(Number(selectedRooms.length + 1) > Number(form.number_of_rooms)){
        dispatch(
          snackbarSlice.setSnackBar({
            type: "warn",
            message: "חריגה ממספר החדרים שהוזמנו",
            timeout: 3000,
          })
        )
      }else {
        dispatch(roomsSlice.addRoomToForm(room));
      }
  
      setIsListOpen(false)
      setSearchTerm("")
    }
  };
  
  const handleDeleteButton = (roomId) => {
    dispatch(roomsSlice.removeRoomFromForm({ roomId: roomId}));
  }


   useEffect(() => {
      getAllRooms()
   }, [])
   useEffect(() => {
    getFamilyRooms()
   }, [])
   
  return (
   <RoomsView 
   submit={submit} 
   handleDeleteButton={handleDeleteButton}
   searchTerm={searchTerm}
   setSearchTerm={setSearchTerm}
   isListOpen={isListOpen}
   setIsListOpen={setIsListOpen}
   roomsChosen={roomsChosen}
   filteredRooms={filteredRooms}
   handleRoomToggle={handleRoomToggle}
   />
  );
};

export default RoomsAssigner;
