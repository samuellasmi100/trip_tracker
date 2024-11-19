import React, { useState,useEffect } from "react";
import MainDialog from "../../../Dialogs/MainDialog/MainDialog";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as snackBarSlice from "../../../../store/slice/snackbarSlice"
import ChildDetails from "../ChildDetails/ChildDetails";
import { Grid } from "@mui/material";
import ParentListView from "./ParentList.view";
import * as userSlice from "../../../../store/slice/userSlice"
import * as dialogSlice from "../../../../store/slice/dialogSlice"

const ParentList = (props) => {
  // const [dialogOpen, setDialogOpen] = useState(false);
  const [showClientDetails, setShowClientDetails] = useState(false);
  // const [dialogType, setDialogType] = useState("addParent");
  const [usersData, setUsersData] = useState([]);
  const [childDataDetails, setChildDataDetails] = useState([]);
  const dispatch = useDispatch();

  const dialogOpen = useSelector((state) => state.dialogSlice.open)
  const dialogType = useSelector((state) => state.dialogSlice.type)


  const closeModal = () => {
    dispatch(dialogSlice.initialActiveButton())
    dispatch(dialogSlice.initialDialogType())
    dispatch(dialogSlice.closeModal())
    setShowClientDetails(false)
  };

  const handleDialogTypeOpen = (type,userData) => {
    dispatch(dialogSlice.updateDialogType(type))
    if(type === "addParent"){
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateParent([]))
    }else if(type === "editParent"){
      if(userData !== undefined){
        dispatch(userSlice.updateParent(userData))
      }
      dispatch(dialogSlice.openModal())
    }else if(type === "addChild"){
      dispatch(dialogSlice.openModal())
      // setUserDetails(userData)
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
     
      let response = await axios.get(`http://localhost:5000/user/child/${user.parentId}`)
      setChildDataDetails(response.data)
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

  {showClientDetails && childDataDetails.length > 0 ?  <ChildDetails childDataDetails={childDataDetails} /> : <></>}

   <MainDialog
      dialogType={dialogType}
      dialogOpen={dialogOpen}
      closeModal={closeModal}

      />
  </Grid>
  )
};

export default ParentList;
