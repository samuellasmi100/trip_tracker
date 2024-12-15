import React, { useEffect,useState } from "react";
import RoomsView from "./RoomsAssigner.view"
import { useDispatch, useSelector } from "react-redux";
import * as roomsSlice from "../../../store/slice/roomsSlice"
import * as snackbarSlice from "../../../store/slice/snackbarSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"
import ApiRooms from "../../../apis/roomsRequest"
import * as userSlice from "../../../store/slice/userSlice";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";

const RoomsAssigner = () => {
  const dispatch = useDispatch()
  const form = useSelector((state) => state.userSlice.form)
  const rooms = useSelector((state) => state.roomsSlice.rooms);
  const [searchTerm, setSearchTerm] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const selectedRooms = useSelector((state) => state.roomsSlice.selectedRooms);
  const token = sessionStorage.getItem("token")
  let roomsChosen = Number(form?.number_of_rooms) - selectedRooms.length
  const vacationId =  useSelector((state) => state.vacationSlice.vacationId)

   const submit = async () => {
      try {
        let startDate = form.arrival_date
        let endDate = form.departure_date
        let familyId = form.family_id
        await ApiRooms.assignRoom(token,selectedRooms,familyId,vacationId,startDate,endDate)  
        await getRoomAvailable()
        dispatch(
          snackBarSlice.setSnackBar({
            type: "success",
            message: "נתוני חדרים עודכנו בהצלחה",
            timeout: 3000,
          })
        )
      dispatch(dialogSlice.updateActiveButton("בחירת חדרים"))

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
      let response = await ApiRooms.getFamilyRoom(token,familyId,vacationId)
      dispatch(roomsSlice.updateSelectedRoomsList(response.data.familyRooms))
    } catch (error) {
      console.log(error)
    }
  }

   const getRoomAvailable = async () => {
    let startDate = form.arrival_date
    let endDate = form.departure_date
    try {
      let response = await ApiRooms.getRoomAvailable(token,vacationId,startDate,endDate)
      dispatch(roomsSlice.updateRoomsList(response.data))
    } catch (error) {
      console.log(error)
    }
   }

  const filteredRooms = rooms?.filter((room) =>{
    if(searchTerm !== ""){
      return room.rooms_id.includes(searchTerm)
    }
   } 
  );

  const handleRoomToggle = (room) => {
    const isSelected = selectedRooms.some((r) => Number(r.rooms_id) === Number(room.rooms_id));
    if (isSelected) {
      dispatch(roomsSlice.removeRoomFromForm({ rooms_id: room.rooms_id }));
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
  
  const handleDeleteButton = (rooms_id) => {
    dispatch(roomsSlice.removeRoomFromForm({ rooms_id: rooms_id}));
  }

  const handleCloseClicked = () => {
   dispatch(roomsSlice.resetForm())
   dispatch(dialogSlice.resetState())
   dispatch(userSlice.resetForm())
   }

   useEffect(() => {
      getRoomAvailable()
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
   handleCloseClicked={handleCloseClicked}
   />
  );
};

export default RoomsAssigner;
