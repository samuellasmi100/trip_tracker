import React, { useState, useEffect } from "react";
import MainDialog from "../../../../Dialogs/MainDialog/MainDialog";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

import FamilyMember from "../FamilyMember/FamilyMember";
import { Grid } from "@mui/material";
import FamilyListView from "./FamilyList.view";
import * as userSlice from "../../../../../store/slice/userSlice";
import * as dialogSlice from "../../../../../store/slice/dialogSlice";
import * as flightsSlice from "../../../../../store/slice/flightsSlice";
import * as roomsSlice from "../../../../../store/slice/roomsSlice";
import * as notesSlice from "../../../../../store/slice/notesSlice";
import * as paymentsSlice from "../../../../../store/slice/paymentsSlice";

const FamilyList = (props) => {
  const [showClientDetails, setShowClientDetails] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const dispatch = useDispatch();
  const dialogOpen = useSelector((state) => state.dialogSlice.open)
  const dialogType = useSelector((state) => state.dialogSlice.type)
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const closeModal = () => {
    dispatch(dialogSlice.initialActiveButton())
    dispatch(dialogSlice.initialDialogType())
    dispatch(dialogSlice.closeModal())
    clearModalForms()
    setShowClientDetails(false)
    dispatch(roomsSlice.resetChildRoom())
  };

  const clearModalForms = () => {
    dispatch(userSlice.resetForm())
    dispatch(flightsSlice.resetForm())
    dispatch(roomsSlice.resetForm())
    dispatch(notesSlice.resetForm())
    dispatch(paymentsSlice.resetForm())
    dispatch(userSlice.updateFamily({}))
  }

  const handleDialogTypeOpen = (type, userData) => {
    dispatch(dialogSlice.updateDialogType(type))
    if (type === "addParent") {
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateParent([]))
    } else if (type === "editParent") {
      if (userData !== undefined) {
        dispatch(userSlice.updateForm(userData))
        dispatch(userSlice.updateParent(userData))
        dispatch(userSlice.updateUserType("parent"))
      }
      dispatch(dialogSlice.openModal())
    } else if (type === "addChild") {
      dispatch(userSlice.updateParent(userData))
      dispatch(userSlice.updateUserType("parent"))
      dispatch(dialogSlice.openModal())
    } else if (type === "editChild") {
      dispatch(userSlice.updateUserType("child"))
      dispatch(userSlice.updateForm(userData))
      dispatch(userSlice.updateChild(userData))
      dispatch(dialogSlice.openModal())
    } else if (type === "addFamily") {
      dispatch(dialogSlice.openModal())
    }else if(type === "childDetails"){
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateForm(userData))
    }else if(type === "parentDetails"){
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateForm(userData))
    }

  };

  const getMainUsers = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/user/all`)
      if (response?.data) {
        dispatch(userSlice.updateParents(response.data))
        setUsersData(response.data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const getFamilies = async () => {
    try {
      let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/user/families`)
      dispatch(userSlice.updateFamiliesList(response.data))
      setUsersData(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleNameClick = async (user) => {
    dispatch(userSlice.updateFamily(user))
    let family_id = user.family_id
    setShowClientDetails(true)
    try {
      let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${family_id}`)
      if(response.data.length > 0){
        dispatch(userSlice.updateGuets(response.data))
      }else {
        dispatch(userSlice.updateGuets([]))

      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpload = async (name,familyId) => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    try {
      // const response = await axios.post("http://localhost:5000/user/families/upload", {
      //   filename: name,
      //   fileType: file.type,
      //   data: base64,
      //   id:familyId
      // });
    } catch (error) {
      console.error("Error uploading file:", error);

    }
  };

const handleFileChange = (e) => {
    // const selectedFile = e.target.files[0];
    // setFile(selectedFile);
    // const reader = new FileReader();
    // reader.onload = () => {
    //   setBase64(reader.result.split(",")[1]);
    // };
    // reader.readAsDataURL(selectedFile);
};

const filteredRooms = usersData?.filter((user) => {
  if (searchTerm !== "") {
    return user.family_name.includes(searchTerm)
  }else {
    return user
  }}
);
  useEffect(() => {
    getMainUsers()
    getFamilies()
  }, [dialogOpen])

  return (
    <Grid style={{ display: "flex",justifyContent:"center" }}>
      <FamilyListView
        tableData={usersData}
        handleDialogTypeOpen={handleDialogTypeOpen}
        handleNameClick={handleNameClick}
        handleUpload={handleUpload}
        handleFileChange={handleFileChange}
        filteredRooms={filteredRooms}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

     <FamilyMember handleDialogTypeOpen={handleDialogTypeOpen} />

      <MainDialog
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        closeModal={closeModal}
      />
    </Grid>
  )
};

export default FamilyList;
