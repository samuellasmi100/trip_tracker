import React, { useEffect, useState } from "react";
import RoomsView from "./RoomSelector.view";
import { useDispatch, useSelector } from "react-redux";
import * as roomsSlice from "../../../store/slice/roomsSlice";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import ApiRoom from "../../../apis/roomsRequest";
import * as userSlice from "../../../store/slice/userSlice";
import ApiRooms from "../../../apis/roomsRequest";


const RoomSelector = () => {
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.roomsSlice.rooms);
  const [searchTerm, setSearchTerm] = useState("");
  const activeButton = useSelector((state) => state.dialogSlice.activeButton);
  const selectedChildRoomId = useSelector(
    (state) => state.roomsSlice.selectedChildRoomId
  );
  const form = useSelector((state) => state.userSlice.form);
  const [roomChosenType, setRoomChosenType] = useState(false);
  const guests = useSelector((state) => state.userSlice.guests);
  
  const [names, setNames] = useState(
    guests.map((key) => {
      return {
        user_id: key.user_id,
        name: key.hebrew_first_name,
        family_id: key.family_id,
      };
    })
  );
  const [guestsRoomList, setGuestsRoomList] = useState([]);

  const vacationId = useSelector((state) => state.vacationSlice.vacationId);

  const expandedRoomId = useSelector(
    (state) => state.roomsSlice.expandedRoomId
  );

  const handleUserCheckboxChange = async (e, userId, roomsId, familyId) => {
    let status = e.target.checked;
    const findRoomDetails = guestsRoomList?.find((room) => Number(room.room_id) === Number(roomsId))
    let badAvailble 
     if(findRoomDetails?.max_occupancy === null){
      badAvailble = findRoomDetails?.base_occupancy
     }else {
      badAvailble = Number(findRoomDetails?.base_occupancy) + Number(findRoomDetails?.max_occupancy)
     }
    
    
    try {
      if(status === true && findRoomDetails !== undefined){
        if(Number(findRoomDetails.people_count) + 1 > Number(badAvailble)){
          dispatch(
            snackBarSlice.setSnackBar({
              type: "warn",
              message: "חריגה מכמות האנשים המקסימלית לחדר",
              timeout: 3000,
            })
          );
           return 
        }else {
          let dataToSend = { userId, roomsId, familyId, status };
          let response = await ApiRoom.assignRoomToGroupOfUser(token, dataToSend,vacationId);
          setGuestsRoomList(response.data.userAssignRoom);
        }
       }else {
        let dataToSend = { userId, roomsId, familyId, status };
      let response = await ApiRoom.assignRoomToGroupOfUser(token, dataToSend,vacationId);
      setGuestsRoomList(response.data.userAssignRoom);
       }
      
    } catch (error) {
      console.log(error);
    }
  };

  const submit = async () => {
    try {
      if (form.user_type === "") {
      } else {
        let response = ApiRoom.assignUserToRoom(
          token,
          selectedChildRoomId,
          form,
          vacationId
        );
      }
      dispatch(
        snackBarSlice.setSnackBar({
          type: "success",
          message: "נתוני חדרים עודכנו בהצלחה",
          timeout: 3000,
        })
      );
      dispatch(dialogSlice.updateActiveButton("טיסות"))

    } catch (error) {
      dispatch(
        snackBarSlice.setSnackBar({
          type: "error",
          message: "נתקלנו בבעיה",
          timeout: 3000,
        })
      );
      console.log(error);
    }
  };

  const handleCheckboxChange = (rooms_id) => {
    const isCurrentlyExpanded = expandedRoomId === rooms_id;
    dispatch(roomsSlice.toggleExpandRoom(rooms_id));
    if (isCurrentlyExpanded) {
      dispatch(roomsSlice.updateChosenRoom(null));
    } else {
      dispatch(roomsSlice.updateChosenRoom(rooms_id));
    }
  };

  const getFamilyRooms = async () => {
    try {
      let familyId = form.family_id;
      let response = await ApiRooms.getFamilyRoom(token, familyId, vacationId);
      dispatch(roomsSlice.updateSelectedRoomsList(response.data.familyRooms));
    } catch (error) {
      console.log(error);
    }
  };

  const getChosenRoom = async () => {
    try {
      let response = await ApiRoom.getChosenRoom(
        token,
        form.user_id,
        vacationId
      );

      if (response.data.length > 0) {
        setRoomChosenType(true);
        dispatch(roomsSlice.updateChosenRoom(response.data[0].rooms_id));
      } else {
        setRoomChosenType(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getUsersChosenRoom = async () => {
    try {
      let response = await ApiRoom.getUsersChosenRoom(
        token,
        form.family_id,
        vacationId
      );
 
      if(response.data.length > 0){
        setGuestsRoomList(response.data);
      }else {
        setGuestsRoomList([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const filteredRooms = rooms?.filter((room) => {
    if (searchTerm !== "") {
      return room.rooms_id.includes(searchTerm);
    }
  });

  const handleCloseClicked = () => {
    dispatch(roomsSlice.resetForm());
    dispatch(dialogSlice.resetState());
    dispatch(userSlice.resetForm());
  };

  useEffect(() => {
    getFamilyRooms();
    getChosenRoom();
    getUsersChosenRoom();
  }, [activeButton]);

  return (
    <RoomsView
      submit={submit}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
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
