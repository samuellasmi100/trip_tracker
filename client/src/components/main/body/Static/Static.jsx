import React from "react";
import StaticView from "./Static.view";
import {Grid} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as staticSlice from "../../../../store/slice/staticSlice"
import Rooms from "./Rooms/Rooms";


const Static = () => {

  const dispatch = useDispatch()
  const activeButton = useSelector((state) => state.staticSlice.activeButton)
  const handleButtonClick = async (buttonName) => {
    dispatch(staticSlice.updateActiveButton(buttonName))
    
 }
 const handleNavButtonClicked = () => {
  if (activeButton === "חדרים") {
    return <Rooms />
  }
  if (activeButton === "מלונות") {
    // return <Rooms />
  }
}
  return(
  <Grid style={{ display: "flex",justifyContent:"center" }}>
  <StaticView handleButtonClick={handleButtonClick} handleNavButtonClicked={handleNavButtonClicked} />;
  </Grid>
  )
};

export default Static;
