import React ,{useState} from "react";
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
  const classes = useStyles();
  const [activeButton, setActiveButton] = useState("יצירת אורח");

  const {
    closeModal,
    dialogOpen,
  } = props;

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  }
const handleDataView = () => {
  if(activeButton === "יצירת אורח"){
    return <Guest closeModal={closeModal}/>
  }else if(activeButton === "חדרים"){
   return <Rooms />
  }else if(activeButton === "טיסות"){
    return <Flights />
  }else if(activeButton === "תשלום"){
    return <Payments />
  }else if(activeButton === "הערות"){
    
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
        <Grid item xs={12} container justifyContent="center" style={{marginTop:"20px",gap:"10px",marginBottom:"30px"}}>
        {["יצירת אורח", "חדרים", "טיסות", "תשלום", "הערות"].map((label) => (
        <Button
          key={label}
          className={`${classes.navButton} ${activeButton === label ? "active" : ""}`}
          onClick={() => handleButtonClick(label)}
        >
          {label}
        </Button>
      ))}

        </Grid>  
        </Grid>

      </Grid>
      {handleDataView()}

      
    </Dialog>
  );
};

export default MainDialogView;
