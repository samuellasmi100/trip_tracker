import React, { useState,useEffect } from "react";
import StaticView from "./Static.view";
import { Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as staticSlice from "../../../../store/slice/staticSlice"
import * as vacationSlice from "../../../../store/slice/vacationSlice"
import Rooms from "./Rooms/Rooms";
import MainDialog from "./MainDialog/MainDialog";
import  ApiVacations from "../../../../apis/vacationRequest"

const Static = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const dialogOpen = useSelector((state) => state.staticSlice.open)
  const dispatch = useDispatch()
  const activeButton = useSelector((state) => state.staticSlice.activeButton)
  const vacationId =  useSelector((state) => state.vacationSlice.vacationId)
  const token = sessionStorage.getItem("token")


  const handleButtonClick = async (buttonName) => {
    dispatch(staticSlice.updateActiveButton(buttonName))

  }
const closeModal = () => {
  dispatch(staticSlice.closeModal())
}


  const handleDialogTypeOpen = (type,room) => {
    dispatch(staticSlice.updateDialogType(type))
    if(type === "editRoom"){
    dispatch(staticSlice.updateForm(room))
    dispatch(staticSlice.openModal())
    }else if(type === "showAvailableDates"){
      dispatch(staticSlice.updateForm(room))
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

  const handleAddIcons = async () => {
    if(activeButton === "חופשות"){
      dispatch(staticSlice.updateDialogType(activeButton))
      dispatch(staticSlice.openModal())
    }
  } 

  const getVacations = async () => {
    try {
      const response = await ApiVacations.getVacations(token,vacationId)
      console.log(response)
      if(response?.data?.vacationsDate?.length > 0){
        dispatch(vacationSlice.updateVacationDatesList(response?.data?.vacationsDate))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getVacations()
  }, [])
  
  return (
    <Grid style={{ display: "flex", justifyContent: "center" }}>
      <StaticView
        handleButtonClick={handleButtonClick}
        handleNavButtonClicked={handleNavButtonClicked}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        handleAddIcons={handleAddIcons}
       
      />;
      <MainDialog dialogOpen={dialogOpen} closeModal={closeModal}/>
    </Grid>
  )
};

export default Static;
