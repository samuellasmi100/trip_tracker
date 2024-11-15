import React, { useState,useEffect } from "react";
import UserLogsView from "./UserLogs.view";
import MainDialog from "../../Dialogs/MainDialog/MainDialog";
import ApiUser from "../../../apis/userRequest";

const UserLogs = (props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("new");
  const [usersData, setUsersData] = useState([]);
  const [sortedClientsUsers, setSortedClientsUsers] = useState();
  const [chosenClientId, setChosenClientId] = useState();
 
  const closeModal = () => {
    setDialogOpen(false);
  };

  const openNewOrEditDialog = (clientUserId) => {
    if (clientUserId) {
      setDialogOpen(true);
      
      setChosenClientId(clientUserId);
      setDialogType("edit");
     
    } else {
      setDialogType("new");
      setDialogOpen(true);
    }

    // setDialogOpen(true);
  };

  const getMainUsers = async () => {
    try {
      let response = await ApiUser.getMainUsers()
      setUsersData(response.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getMainUsers()
  }, [])
  
  return(
  <>
  <UserLogsView setDialogOpen={setDialogOpen} tableData={usersData}/>;

   <MainDialog
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        clientUserId={chosenClientId}
        setDialogOpen={setDialogOpen}
        closeModal={closeModal}
      />
  </>
  )
};

export default UserLogs;
