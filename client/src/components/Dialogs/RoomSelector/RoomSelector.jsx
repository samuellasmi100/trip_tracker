import React, { useEffect, useState } from "react";
import RoomsView from "./RoomSelector.view"
import { useDispatch, useSelector } from "react-redux";
import * as roomsSlice from "../../../store/slice/roomsSlice"
import * as snackBarSlice from "../../../store/slice/snackbarSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice"
import ApiRoom from "../../../apis/roomsRequest"
import * as userSlice from "../../../store/slice/userSlice";
import  ApiRooms from "../../../apis/roomsRequest"
const RoomSelector = () => {
  const token = sessionStorage.getItem("token")
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
    return {userId:key.user_id,name:key.hebrew_first_name,family_id:key.family_id}
  }));
 const [guestsRoomList, setGuestsRoomList] = useState([])
 const vacationId =  useSelector((state) => state.vacationSlice.vacationId)

 const expandedRoomId = useSelector(
  (state) => state.roomsSlice.expandedRoomId
);

  
  const handleUserCheckboxChange = async(e,userId, roomsId, familyId) => {
   let status = e.target.checked
   try {
    let dataTosend = {userId, roomsId, familyId,status}

    let response = await ApiRoom.assignRoomToGroupOfUser(token,dataTosend)
    setGuestsRoomList(response.data.userAssignRoom)
   } catch (error) {
    console.log(error)
   }
  };


  const submit = async () => {
    console.log(selectedChildRoomId)
    try {
      let response
      if(form.user_type === ""){

      }else {
        if(roomChossenType){
          response = ApiRoom.updateUserToRoom(token,selectedChildRoomId, form,vacationId )
        }else {
            response = ApiRoom.assignUserToRoom(token,selectedChildRoomId,form,vacationId)
        }
      }
     
      dispatch(
        snackBarSlice.setSnackBar({
          type: "error",
          message: "נתוני חדרים עודכנו בהצלחה",
          timeout: 3000,
        })
      )
    } catch (error) {
      dispatch(
        snackBarSlice.setSnackBar({
          type: "error",
          message: "נתקלנו בבעיה",
          timeout: 3000,
        })
      )
      console.log(error)
    }
  }

const handleCheckboxChange = (rooms_id) => {
  // Update both selected room and expanded room
  const isCurrentlyExpanded = expandedRoomId === rooms_id;

  // Toggle expanded state
  dispatch(roomsSlice.toggleExpandRoom(rooms_id));

  // If the room is expanded, update selectedChildRoomId (select room)
  if (isCurrentlyExpanded) {
    // Deselect the room (if it was previously selected)
    dispatch(roomsSlice.updateChossenRoom(null));
  } else {
    // Select the room and expand it
    dispatch(roomsSlice.updateChossenRoom(rooms_id));
  }
};


  const getFamilyRooms = async () => {
    try {
      let familyId = form.family_id
      let response = await ApiRooms.getFamilyRoom(token,familyId,vacationId)
      dispatch(roomsSlice.updateSelectedRoomsList(response.data.familyRooms))
    } catch (error) {
      console.log(error)
    }
  }

  const getChossenRoom = async () => {
    try {
        let response = await ApiRoom.getUserRoom(token,form.user_id)
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
      return room.rooms_id.includes(searchTerm)
    }
  }
  );

  const handleCloseClicked = () => {
    dispatch(roomsSlice.resetForm())
   dispatch(dialogSlice.resetState())
   dispatch(userSlice.resetForm())
   }

  useEffect(() => {
    getFamilyRooms()
    // getChossenRoom()
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
      handleCloseClicked={handleCloseClicked}
    />
  );
};

export default RoomSelector;
