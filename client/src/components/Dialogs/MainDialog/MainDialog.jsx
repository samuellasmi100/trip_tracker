import React, { useEffect, useState } from "react";
import MainDialogView from "./MainDialog.view";
import GuestWizard from "../Guest/GuestWizard";
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
import UploadFile from "../UploadFile/UploadFile";
import ShowFiles from "../ShowFiles/ShowFiles";

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

  // Add flows use the wizard (self-contained stepper, no external nav buttons needed)
  const isWizardFlow = dialogType === "addFamily" || dialogType === "addParent" || dialogType === "addChild";

  const handleButtonClick = async (buttonName) => {
    dispatch(dialogSlice.updateActiveButton(buttonName))
  }

  const handleDataView = () => {
    if(dialogType === "childDetails" || dialogType === "parentDetails"){
      return <ChildDetails />
    }else if(dialogType === "uploadFile"){
      if( activeButton === "העלה קובץ"){
        return <UploadFile />
      }else {
        return <ShowFiles />
      }
    } else if(isWizardFlow){
      // Wizard handles its own steps internally
      return <GuestWizard />
    } else{
       if (activeButton === "פרטים אישיים") {
        return <GuestWizard />
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
    // Wizard flows handle their own navigation via the stepper — no header buttons
    if(isWizardFlow){
      return null;
    }
    if(dialogType === "childDetails" || dialogType === "parentDetails"){
      return null;
    }else if(dialogType === "uploadFile"){
      return ["העלה קובץ","הצג קבצים שהועלו",]
      .map((label) => (
        <Button
          key={label}
          className={`${classes.navButton} ${activeButton === label ? "active" : ""}`}
          onClick={() => handleButtonClick(label)}>
          {label}
        </Button>
       ))
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
