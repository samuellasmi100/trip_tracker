import React, { useState,useEffect } from "react";
import MainDialog from "../../../Dialogs/MainDialog/MainDialog";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as snackBarSlice from "../../../../store/slice/snackbarSlice"
import ChildDetails from "../ChildDetails/ChildDetails";
import { Grid } from "@mui/material";
import ParentListView from "./ParentList.view";
import * as userSlice from "../../../../store/slice/userSlice";
import * as dialogSlice from "../../../../store/slice/dialogSlice";
import * as flightsSlice  from "../../../../store/slice/flightsSlice";
import * as roomsSlice  from "../../../../store/slice/roomsSlice";
import * as notesSlice  from "../../../../store/slice/notesSlice";
import * as paymentsSlice  from "../../../../store/slice/paymentsSlice";

const ParentList = (props) => {
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [childDataDetails, setChildDataDetails] = useState([]);
  const dispatch = useDispatch();
  const dialogOpen = useSelector((state) => state.dialogSlice.open)
  const dialogType = useSelector((state) => state.dialogSlice.type)


  const closeModal = () => {
    dispatch(dialogSlice.initialActiveButton())
    dispatch(dialogSlice.initialDialogType())
    dispatch(dialogSlice.closeModal())
    clearModalForms()
    setShowClientDetails(false)
  };

  const clearModalForms = () => {
    dispatch(userSlice.resetForm())
    dispatch(flightsSlice.resetForm())
    dispatch(roomsSlice.resetForm())
    dispatch(notesSlice.resetForm())
    dispatch(paymentsSlice.resetForm())
  }

  const handleDialogTypeOpen = (type,userData) => {
    dispatch(dialogSlice.updateDialogType(type))
    if(type === "addParent"){
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateParent([]))
    }else if(type === "editParent"){
      if(userData !== undefined){
        dispatch(userSlice.updateForm(userData))
        dispatch(userSlice.updateParent(userData))
        dispatch(userSlice.updateUserType("parent"))
      }
      dispatch(dialogSlice.openModal())
    }else if(type === "addChild"){
      dispatch(userSlice.updateParent(userData))
      dispatch(userSlice.updateUserType("parent"))
      dispatch(dialogSlice.openModal())
    }else if(type === "editChild"){
      dispatch(userSlice.updateUserType("child"))
      dispatch(userSlice.updateForm(userData))
      dispatch(userSlice.updateChild(userData))
      dispatch(dialogSlice.openModal())
    }
   
  };

  const getMainUsers = async () => {
    try {
      let response = await axios.get("http://localhost:5000/user/all")
      dispatch(userSlice.updateParents(response.data))
      setUsersData(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleNameClick = async (user) => {
    dispatch(userSlice.updateParent(user))
    setShowClientDetails(true)
    try {    
      let response = await axios.get(`http://localhost:5000/user/child/${user.parent_id}`)
      setChildDataDetails(response.data)
      dispatch(userSlice.updateChildren(response.data))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getMainUsers()
  }, [dialogOpen])
  
  return(
  <Grid style={{display:"flex"}}>
    
  <ParentListView 
  tableData={usersData} 
  handleDialogTypeOpen={handleDialogTypeOpen} 
  handleNameClick={handleNameClick}
  />

  {showClientDetails && childDataDetails.length > 0 ?  <ChildDetails handleDialogTypeOpen={handleDialogTypeOpen} /> : <></>}

   <MainDialog
      dialogType={dialogType}
      dialogOpen={dialogOpen}
      closeModal={closeModal}

      />
  </Grid>
  )
};

export default ParentList;
