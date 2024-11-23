import React, { useEffect, useState } from "react";
import MainDialogView from "./MainDialog.view";
import Guest from "../Guest/Guest";
import RoomSelector from "../RoomSelector/RoomSelector";
import RoomsAssigner from "../RoomsAssigner/RoomsAssigner";
import Payments from "../Payments/Payments";
import Flights from "../Flights/Flights";
import Notes from "../Notes/Notes"
import { Button } from "@mui/material";
import { useStyles } from "./MainDialog.style";
import axios from "axios";
import * as dialogSlice from "../../../store/slice/dialogSlice"
import { useDispatch, useSelector } from "react-redux";
import * as userSlice from "../../../store/slice/userSlice"

const MainDialog = (props) => {
  const form = useSelector((state) => state.userSlice.form)
  const activeButton = useSelector((state) => state.dialogSlice.activeButton)
  const classes = useStyles();
  const dispatch = useDispatch()
  const {
    dialogType,
    dialogOpen,
    closeModal
  } = props;

  
  const handleButtonClick = async (buttonName) => {
    dispatch(dialogSlice.updateActiveButton(buttonName))
  }
  
  const handleDataView = () => {

    if (activeButton === "עדכון אורח") {
      return <Guest />
    } else if (activeButton === "הקצאת חדרים") {
      return <RoomsAssigner />
    }else if(activeButton === "בחירת חדרים"){
      return <RoomSelector />
    } else if (activeButton === "טיסות") {
      return <Flights  />
    } else if (activeButton === "תשלום") {
      return <Payments />
    } else if (activeButton === "הערות") {
      return <Notes />
    }
  }

  const handleButtonHeader = () => {
    if(form.child_id !== null){
      return (Number(form.flights) === 1
      ?  ["עדכון אורח", "בחירת חדרים", "טיסות", "הערות"] 
      :  ["עדכון אורח", "בחירת חדרים", "הערות"]
    ).map((label) => (
      <Button
        key={label}
        className={`${classes.navButton} ${activeButton === label ? "active" : ""}`}
        onClick={() => handleButtonClick(label)}>
        {label}
      </Button>
     ))
    }else {
      return (Number(form.flights) === 1
        ?  ["עדכון אורח","הקצאת חדרים","בחירת חדרים", "טיסות", "תשלום", "הערות"] 
        :  ["עדכון אורח", "הקצאת חדרים", "בחירת חדרים","תשלום", "הערות"]
      ).map((label) => (
        <Button
          key={label}
          className={`${classes.navButton} ${activeButton === label ? "active" : ""}`}
          onClick={() => handleButtonClick(label)}>
          {label}
        </Button>
      ))
    }
      
  }

  return (
       <MainDialogView
       dialogOpen={dialogOpen}
       closeModal={closeModal}
       handleDataView={handleDataView}
       handleButtonHeader={handleButtonHeader}
      />
  );
};

export default MainDialog;
