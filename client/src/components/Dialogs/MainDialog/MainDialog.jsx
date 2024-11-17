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
   const [form, setForm] = useState({
    roomType:"",
    floor:"",
    size:"",
    direction:""
   })

   const [filteredOptions, setFilteredOptions] = useState({
    floors: [],
    sizes: [],
    directions: [],
  });

  useEffect(() => {
    console.log(form)
    if (form.roomType) {
      const filtered = rooms?.filter(
        (room) => room.roomType === form.roomType
      );
      setFilteredOptions({
        floors: [...new Set(filtered.map((room) => room.roomFloor))],
        sizes: [...new Set(filtered.map((room) => room.roomSize))],
        directions: [...new Set(filtered.map((room) => room.roomDirection))],
      });
    } else {
      setFilteredOptions({ floors: [], sizes: [], directions: [] });
    }
  }, [form.roomType])


  const handleButtonClick = async (buttonName) => {
    if(buttonName === "חדרים"){
      const response =  await axios.get("http://localhost:5000/rooms")
      setRooms(response.data)
      const uniqueRoomTypes = [...new Set(response.data.map(room => room.roomType))];
      setRoomType(uniqueRoomTypes)
    }
    setActiveButton(buttonName);
  }

  const handleDataView = () => {
    if (activeButton === "עדכון אורח") {
      return <Guest closeModal={closeModal} userDetails={userDetails} dialogType={dialogType}/>
    } else if (activeButton === "חדרים") {
      return <Rooms closeModal={closeModal} roomType={roomType} form={form} setForm={setForm} filteredOptions={filteredOptions}/>
    } else if (activeButton === "טיסות") {
      return <Flights />
    } else if (activeButton === "תשלום") {
      return <Payments />
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
