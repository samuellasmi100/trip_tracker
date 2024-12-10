import React, { useEffect, useState } from "react";
import MainDialogView from "./MainDialog.view";
import Guest from "../Guest/Guest";
import RoomSelector from "../RoomSelector/RoomSelector";
import RoomsAssigner from "../RoomsAssigner/RoomsAssigner";
import Payments from "../Payments/Payments";
import Flights from "../Flights/Flights";
import Reservation from "../Reservation/Reservation";
import Notes from "../Notes/Notes"
import { Button } from "@mui/material";
import { useStyles } from "./MainDialog.style";

import * as dialogSlice from "../../../store/slice/dialogSlice"
import { useDispatch, useSelector } from "react-redux";
import ChildDetails from "../ChildDetails/ChildDetails"

const MainDialog = (props) => {
  const form = useSelector((state) => state.userSlice.form)
  const activeButton = useSelector((state) => state.dialogSlice.activeButton)
  const classes = useStyles();
  const dialogType = useSelector((state) => state.dialogSlice.type);

  const dispatch = useDispatch()
  const {
    dialogOpen,
    closeModal
  } = props;

  
  const handleButtonClick = async (buttonName) => {
    
    dispatch(dialogSlice.updateActiveButton(buttonName))
  }
  
  const handleDataView = () => {
    if(dialogType === "childDetails" || dialogType === "parentDetails"){
      return <ChildDetails />
    }else {
       if (activeButton === "פרטים אישיים") {
        return <Guest />
      } else if (activeButton === "פרטי הזמנה" || activeButton === "פרטי נסיעה" ) {
        return <Reservation />
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
   
  }

  const handleButtonHeader = () => {
    if(dialogType === "childDetails" || dialogType === "parentDetails" || dialogType === "addChild" || dialogType === "addParent"){
    }else {
        if(form.user_type === "client"){
          return (Number(form.flights) === 1
          ?  ["פרטים אישיים","פרטי נסיעה", "בחירת חדרים", "טיסות", "הערות"] 
          :  ["פרטים אישיים","פרטי נסיעה", "בחירת חדרים", "הערות"]
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
            ?  ["פרטים אישיים","פרטי הזמנה","הקצאת חדרים","בחירת חדרים", "טיסות", "תשלום", "הערות"] 
            :  ["פרטים אישיים","פרטי הזמנה", "הקצאת חדרים", "בחירת חדרים","תשלום", "הערות"]
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
