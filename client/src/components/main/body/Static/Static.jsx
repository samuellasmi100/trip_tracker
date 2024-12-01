import React, { useState } from "react";
import StaticView from "./Static.view";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as staticSlice from "../../../../store/slice/staticSlice"
import Rooms from "./Rooms/Rooms";
import MainDialog from "./MainDialog/MainDialog";

const Static = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dialogOpen = useSelector((state) => state.staticSlice.open)
  const dispatch = useDispatch()
  const activeButton = useSelector((state) => state.staticSlice.activeButton)

  const handleButtonClick = async (buttonName) => {
    dispatch(staticSlice.updateActiveButton(buttonName))

  }
const closeModal = () => {
  dispatch(staticSlice.closeModal())
}
  const handleDialogTypeOpen = (type,room) => {
    dispatch(staticSlice.updateDialogType(type))
    if(type === "editRoom"){
    dispatch(staticSlice.updateRoomDetails(room))

      dispatch(staticSlice.openModal())
    }
 
  }
  const handleNavButtonClicked = () => {
    if (activeButton === "חדרים") {
      return <Rooms searchTerm={searchTerm} handleDialogTypeOpen={handleDialogTypeOpen}/>
    }
    if (activeButton === "מלונות") {
      // return <Rooms />
    }
  }
  return (
    <Grid style={{ display: "flex", justifyContent: "center" }}>
      <StaticView
        handleButtonClick={handleButtonClick}
        handleNavButtonClicked={handleNavButtonClicked}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
      />;
      <MainDialog dialogOpen={dialogOpen} closeModal={closeModal}/>
    </Grid>
  )
};

export default Static;
