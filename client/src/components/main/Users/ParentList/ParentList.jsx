import React, { useState,useEffect } from "react";
import UserLogsView from "./ParentList.view";
import MainDialog from "../../../Dialogs/MainDialog/MainDialog";
import ApiUser from "../../../../apis/userRequest";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as snackBarSlice from "../../../../store/slice/snackbarSlice"
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-quartz.css'
import ChildDetails from "../ChildDetails/ChildDetails";
import { Grid } from "@mui/material";

const ParentList = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [dialogType, setDialogType] = useState("addParent");
  const [usersData, setUsersData] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [childDataDetails, setChildDataDetails] = useState([]);
  const dispatch = useDispatch();

  const closeModal = () => {
    setDialogOpen(false);
    setShowClientDetails(false)
  };

  const handleDialogTypeOpen = (type,userData) => {
    if(type === "addParent"){
      setDialogOpen(true)
      setDialogType(type);
      setUserDetails([])
    }else if(type === "editParent"){
      if(userData !== undefined){
       setUserDetails(userData)
      }
      setDialogOpen(true)
      setDialogType(type);
  
    }else if(type === "addChild"){
      setDialogOpen(true)
      setDialogType(type)
      setUserDetails(userData)
    }
   
  };

  const getMainUsers = async () => {
    try {
      let response = await axios.get("http://localhost:5000/user/all")
      setUsersData(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleNameClick = async (id) => {
    setShowClientDetails(true)
    try {
      
      let response = await axios.get(`http://localhost:5000/user/child/${id}`)
      setChildDataDetails(response.data)
      // let response = await ApiUser.getChildUser(id)
      console.log(response)
      // setUsersData(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getMainUsers()
  }, [dialogOpen])
  
  return(
  <Grid style={{display:"flex"}}>
    
  <UserLogsView setDialogOpen={setDialogOpen} tableData={usersData} handleDialogTypeOpen={handleDialogTypeOpen} handleNameClick={handleNameClick}/>;
  {showClientDetails && childDataDetails.length > 0 ?  <ChildDetails childDataDetails={childDataDetails} /> : <></>}

   <MainDialog
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        closeModal={closeModal}
        userDetails={userDetails}
      />
  </Grid>
  )
};

export default ParentList;
