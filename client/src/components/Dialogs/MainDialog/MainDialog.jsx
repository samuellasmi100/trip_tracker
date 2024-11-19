import React, { useEffect, useState } from "react";
import MainDialogView from "./MainDialog.view";
import Guest from "../Guest/Guest";
import Rooms from "../Rooms/Rooms";
import Payments from "../Payments/Payments";
import Flights from "../Flights/Flights";
import { Button } from "@mui/material";
import { useStyles } from "./MainDialog.style";
import axios from "axios";
import * as dialogSlice from "../../../store/slice/dialogSlice"
import { useDispatch, useSelector } from "react-redux";
import * as userSlice from "../../../store/slice/userSlice"

const MainDialog = (props) => {
  const userDetails = useSelector((state) => state.userSlice.parent)

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
