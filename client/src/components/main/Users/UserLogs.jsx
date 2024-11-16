import React, { useState,useEffect } from "react";
import UserLogsView from "./UserLogs.view";
import MainDialog from "../../Dialogs/MainDialog/MainDialog";
import ApiUser from "../../../apis/userRequest";

const UserLogs = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("new");
  const [usersData, setUsersData] = useState([]);
  const [userDetails, setUserDetails] = useState([]);
  const [sortedClientsUsers, setSortedClientsUsers] = useState();
  const [chosenClientId, setChosenClientId] = useState();
 
  const closeModal = () => {
    setDialogOpen(false);
  };

  const handleDialogTypeOpen = (type,userData) => {
    if(type === "new"){
      setDialogOpen(true)
      setDialogType(type);
      setUserDetails([])
    }else if(type === "edit"){
      if(userData !== undefined){
       setUserDetails(userData)
      }
      setDialogOpen(true)
      setDialogType(type);
  
    }else if(type === "child"){
      setDialogOpen(true)
      setDialogType(type)
      setUserDetails(userData)
    }
   
  };

  const getMainUsers = async () => {
    try {
      let response = await ApiUser.getMainUsers()
      setUsersData(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  const handleNameClick = async (id) => {
    try {
      let response = await ApiUser.getChildUser(id)
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
  <>
  <UserLogsView setDialogOpen={setDialogOpen} tableData={usersData} handleDialogTypeOpen={handleDialogTypeOpen} handleNameClick={handleNameClick}/>;

   <MainDialog
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
        closeModal={closeModal}
        userDetails={userDetails}
      />
  </>
  )
};

export default UserLogs;
