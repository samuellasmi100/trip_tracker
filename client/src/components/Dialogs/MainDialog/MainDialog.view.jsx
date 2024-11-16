import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  setRef,
} from "@mui/material";
import { useStyles } from "./MainDialog.style";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import Guest from "../Guest/Guest";
import Rooms from "../Rooms/Rooms";
import Payments from "../Payments/Payments";
import { Flight } from "@mui/icons-material";
import Flights from "../Flights/Flights";

const MainDialogView = (props) => {
  const {
    dialogType,
    dialogOpen,
    setDialogOpen,
    closeModal,
    userDetails
  } = props;
  const classes = useStyles();
  const [activeButton, setActiveButton] = useState("עדכון אורח");

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  }
  const handleDataView = () => {
    if (activeButton === "עדכון אורח") {
      return <Guest closeModal={closeModal} userDetails={userDetails} dialogType={dialogType}/>
    } else if (activeButton === "חדרים") {
      return <Rooms />
    } else if (activeButton === "טיסות") {
      return <Flights />
    } else if (activeButton === "תשלום") {
      return <Payments />
    } else if (activeButton === "הערות") {

    }
  }

const handleButtonHeader = () => {
  if(dialogType === "new"){
    return <></>
  }else if(dialogType === "edit"){
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
     
  }else if(dialogType === "child"){
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
    <Dialog
      open={dialogOpen}
      classes={{ paper: classes.dialog }}
      onClose={closeModal}
    >
      <Grid container>
        <Grid
          item
          container
          xs={12}
          style={{ marginTop: "30px", marginLeft: "30px" }}
          alignContent="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} container justifyContent="center" style={{ marginTop: "20px", gap: "10px", marginBottom: "30px" }}>
         { handleButtonHeader()}
          </Grid>
        </Grid>

      </Grid>
      {handleDataView()}


    </Dialog>
  );
};

export default MainDialogView;
