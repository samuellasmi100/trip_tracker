import React, { useEffect, useState } from "react";
import MainDialogView from "./MainDialog.view";
import Guest from "../Guest/Guest";
import Rooms from "../Rooms/Rooms";
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
  const parentDetails = useSelector((state) => state.userSlice.parent)
  const childDetails = useSelector((state) => state.userSlice.child)
  const child = useSelector((state) => state.userSlice.child)
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
    } else if (activeButton === "חדרים") {
      return <Rooms />
    } else if (activeButton === "טיסות") {
      return <Flights  />
    } else if (activeButton === "תשלום") {
      return <Payments />
    } else if (activeButton === "הערות") {
      return <Notes />
    }
  }

  const handleButtonHeader = () => {
  if(dialogType === "addParent"){
    return <></>
  }else if(dialogType === "editParent"){
      return (parentDetails.flights === 1
        ?  ["עדכון אורח", "חדרים", "טיסות", "תשלום", "הערות"] 
        :  ["עדכון אורח", "חדרים", "תשלום", "הערות"]
      ).map((label) => (
        <Button
          key={label}
          className={`${classes.navButton} ${activeButton === label ? "active" : ""}`}
          onClick={() => handleButtonClick(label)}>
          {label}
        </Button>
      ))
     }else if(dialogType === "editChild"){
      return (child.flights === 1
        ?  ["עדכון אורח", "חדרים", "טיסות", "הערות"] 
        :  ["עדכון אורח", "חדרים","הערות"]
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
