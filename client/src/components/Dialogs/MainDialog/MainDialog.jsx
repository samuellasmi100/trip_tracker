import React, { useEffect, useState } from "react";
import MainDialogView from "./MainDialog.view";
import ApiClient from "../../../apis/clientRequest";
import ApiRegion from "../../../apis/regionRequest";
import ApiUser from "../../../apis/userRequest";
import { useSelector } from "react-redux";
import Guest from "../Guest/Guest";
import Rooms from "../Rooms/Rooms";
import Payments from "../Payments/Payments";
import Flights from "../Flights/Flights";
import { Button } from "@mui/material";
import { useStyles } from "./MainDialog.style";
import axios from "axios";

const MainDialog = (props) => {
  const classes = useStyles();

  const {
    dialogType,
    dialogOpen,
    setDialogOpen,
    closeModal,
    userDetails
  } = props;

  const [activeButton, setActiveButton] = useState("עדכון אורח");
   const [roomType, setRoomType] = useState([])
   const [rooms, setRooms] = useState([])
   const [roomsFromDB, setRoomsFromDb] = useState([])
   const [form, setForm] = useState([])

   const [filteredOptions, setFilteredOptions] = useState(
    Array(userDetails.numberOfRooms).fill({ floors: [], sizes: [], directions: [] })
  );

  useEffect(() => {
    if (roomsFromDB?.length > 0) {
      const preloadedForm = roomsFromDB.map((room) => ({
        roomId: room.roomId,
        roomType: room.roomType,
        floor: room.roomFloor,
        size: room.roomSize,
        direction: room.roomDirection,
      }));
        setForm(preloadedForm);
        const options = preloadedForm.map((currentRoom) => {
          const filtered = roomsFromDB.filter(
            (room) => room.roomType === currentRoom.roomType
          );
          return {
            roomId: currentRoom.roomId,
            floors: [...new Set(filtered.map((room) => room.roomFloor))],
            sizes: [...new Set(filtered.map((room) => room.roomSize))],
            directions: [...new Set(filtered.map((room) => room.roomDirection))],
          };
        });
        setFilteredOptions(options);
    } else if (userDetails?.numberOfRooms) {
      // Initialize empty form if no preloaded data exists
      const emptyForm = Array.from({ length: userDetails.numberOfRooms }, () => ({
        roomId: "",
        roomType: "",
        floor: "",
        size: "",
        direction: "",
      }));
      setForm(emptyForm);
      setFilteredOptions(
        Array.from({ length: userDetails.numberOfRooms }, () => ({
          roomId: "",
          floors: [],
          sizes: [],
          directions: [],
        }))
      );
    }
   
  }, [roomsFromDB, userDetails?.numberOfRooms]);


  const handleButtonClick = async (buttonName) => {
    if(buttonName === "חדרים"){
      const checkIfAlreadyChoosenRooms = await axios.get(`http://localhost:5000/rooms/${userDetails.parentId}`)
      if(checkIfAlreadyChoosenRooms.data.length > 0){
        setRoomsFromDb(checkIfAlreadyChoosenRooms.data)
        const uniqueRoomTypes = [...new Set(checkIfAlreadyChoosenRooms.data.map(room => room.roomType))];
        setRoomType(uniqueRoomTypes)
      }else {
       const response =  await axios.get("http://localhost:5000/rooms")
      setRooms(response.data)
      const uniqueRoomTypes = [...new Set(response.data.map(room => room.roomType))];
      setRoomType(uniqueRoomTypes)
      }
      console.log(checkIfAlreadyChoosenRooms)
     
    }
    setActiveButton(buttonName);
  }

  const handleDataView = () => {
    if (activeButton === "עדכון אורח") {
      return <Guest closeModal={closeModal} userDetails={userDetails} dialogType={dialogType}/>
    } else if (activeButton === "חדרים") {
      return <Rooms closeModal={closeModal} roomType={roomType} form={form} 
      setForm={setForm} filteredOptions={filteredOptions} userDetails={userDetails} submit={submit}/>
    } else if (activeButton === "טיסות") {
      return <Flights closeModal={closeModal} userDetails={userDetails}/>
    } else if (activeButton === "תשלום") {
      return <Payments userDetails={userDetails}/>
    } else if (activeButton === "הערות") {

    }
  }

  const handleButtonHeader = () => {
  if(dialogType === "addParent"){
    return <></>
  }else if(dialogType === "editParent"){
      return (userDetails.flights === 1
        ?  ["עדכון אורח", "חדרים", "טיסות", "תשלום", "הערות"] 
        :  ["עדכון אורח", "חדרים", "תשלום", "הערות"]
      ).map((label) => (
        <Button
          key={label}
          className={`${classes.navButton} ${activeButton === label ? "active" : ""}`}
          onClick={() => handleButtonClick(label)}
        >
          {label}
        </Button>
      ))
     
  }else if(dialogType === "addChild"){
    return (
     
   ["עדכון אורח", "חדרים", "טיסות", "הערות"] 
    
    ).map((label) => (
      <Button
        key={label}
        className={`${classes.navButton} ${activeButton === label ? "active" : ""}`}
        onClick={() => handleButtonClick(label)}
      >
        {label}
      </Button>
    ))
  }
  }

  const submit = async () => {
    const updatedRooms = form.map(room => {
      const matchedRoom = rooms.find(
          largeRoom =>
              largeRoom.roomType === room.roomType &&
              largeRoom.roomFloor.toString() === room.floor &&
              largeRoom.roomSize === room.size &&
              largeRoom.roomDirection === room.direction
      );
      if (matchedRoom) {
          return { ...room, roomId: matchedRoom.roomId,parentId:userDetails.parentId };
      } else {
          return room;
      }
  });

  try {
    const response =  await axios.post("http://localhost:5000/rooms",updatedRooms)
  } catch (error) {
    console.log(error)
  }
  console.log(updatedRooms)
  }
  return (
       <MainDialogView
       dialogType={dialogType}
       dialogOpen={dialogOpen}
       setDialogOpen={setDialogOpen}
       closeModal={closeModal}
       userDetails={userDetails}
       handleButtonClick={handleButtonClick}
       handleDataView={handleDataView}
       handleButtonHeader={handleButtonHeader}
      />
  );
};

export default MainDialog;
