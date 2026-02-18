import React, { useState, useEffect } from "react";
import MainDialog from "../../../../../Dialogs/MainDialog/MainDialog";
import { useDispatch, useSelector } from "react-redux";
import ApiUser from "../../../../../../apis/userRequest"
import ApiVacations from "../../../../../../apis/vacationRequest"
import FamilyMember from "../FamilyMember/FamilyMember";
import { Grid, Typography } from "@mui/material";
import FamilyListView from "./FamilyList.view";
import * as userSlice from "../../../../../../store/slice/userSlice";
import * as dialogSlice from "../../../../../../store/slice/dialogSlice";
import * as flightsSlice from "../../../../../../store/slice/flightsSlice";
import * as roomsSlice from "../../../../../../store/slice/roomsSlice";
import * as notesSlice from "../../../../../../store/slice/notesSlice";
import * as vacationSlice from "../../../../../../store/slice/vacationSlice";
import * as paymentsSlice from "../../../../../../store/slice/paymentsSlice";

const FamilyList = () => {
  const vacationId = useSelector((state) => state.vacationSlice.vacationId)
  const [usersData, setUsersData] = useState([]);
  const dispatch = useDispatch();
  const dialogOpen = useSelector((state) => state.dialogSlice.open)
  const dialogType = useSelector((state) => state.dialogSlice.type)
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const token = sessionStorage.getItem('token')
  const vacationList = useSelector((state) => state.vacationSlice.vacations)
  const chosenFamily = useSelector((state) => state.userSlice.family)

  const closeModal = () => {
    dispatch(dialogSlice.initialActiveButton())
    dispatch(dialogSlice.initialDialogType())
    dispatch(dialogSlice.closeModal())
    clearModalForms()
    dispatch(roomsSlice.resetChildRoom())
  };

  const clearModalForms = () => {
    dispatch(userSlice.resetForm())
    dispatch(flightsSlice.resetForm())
    dispatch(roomsSlice.resetForm())
    dispatch(notesSlice.resetForm())
    dispatch(paymentsSlice.resetForm())
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
    } else if (type === "childDetails") {
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateForm(userData))
    } else if (type === "parentDetails") {
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateForm(userData))
    }else if (type === "uploadFile") {
      dispatch(dialogSlice.updateActiveButton("העלה קובץ"))
      dispatch(dialogSlice.openModal())
      dispatch(userSlice.updateForm(userData))
    }

  };

  const getFamilies = async () => {
    try {
      if (vacationId !== "") {
        let response = await ApiUser.getFamilyList(token, vacationId)
        dispatch(userSlice.updateFamiliesList(response.data))
        setUsersData(response.data)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleNameClick = async (user) => {
  
    dispatch(userSlice.updateFamily(user))
    let family_id = user.family_id
    try {
      let response = await ApiUser.getUserFamilyList(token, family_id, vacationId)
      if (response.data.length > 0) {
        dispatch(userSlice.updateGuest(response.data))
      } else {
        dispatch(userSlice.updateGuest([]))

      }
    } catch (error) {
      console.log(error)
    }
  }

  const getChosenFamily = async () => {
    dispatch(userSlice.updateFamily(chosenFamily))
    let family_id = chosenFamily.family_id
    try {
      let response = await ApiUser.getUserFamilyList(token, family_id, vacationId)
      if (response.data.length > 0) {
        dispatch(userSlice.updateGuest(response.data))
      } else {
        dispatch(userSlice.updateGuest([]))

      }
    } catch (error) {
      console.log(error)
    }
  } 

  const filteredFamilyList = usersData?.filter((user) => {
    if (searchTerm !== "") {
      return user.family_name.includes(searchTerm)
    } else {
      return user
    }
  }
  );

  const getVacations = async () => {
    try {
      const response = await ApiVacations.getVacations(token)
      if (response?.data?.vacations?.length > 0) {
        dispatch(vacationSlice.updateVacationList(response?.data?.vacations))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSelectInputChange = async (e) => {
    closeModal()
    clearModalForms()
    dispatch(userSlice.updateFamiliesList([]))
    dispatch(userSlice.updateGuest([]))
    const getVacationId = vacationList?.find((key) => {
      return key.name === e.target.value
    })
    dispatch(vacationSlice.updateChosenVacation(getVacationId.vacation_id))
    dispatch(vacationSlice.updateVacationName(getVacationId.name))
    sessionStorage.setItem("vacId", getVacationId.vacation_id)
    sessionStorage.setItem("vacName", getVacationId.name)
    try {
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getFamilies()
    getChosenFamily()
  }, [dialogOpen, vacationId])

  useEffect(() => {
    getVacations()
  }, [])
  return (
    <Grid style={{ display: "flex", flexDirection: "column" }}>
      <Grid style={{ display: "flex", justifyContent: "center", gap: "16px", padding: "16px" }}>
        <FamilyListView
          handleDialogTypeOpen={handleDialogTypeOpen}
          handleNameClick={handleNameClick}
          filteredFamilyList={filteredFamilyList}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          handleSelectInputChange={handleSelectInputChange}
        />
        <FamilyMember handleDialogTypeOpen={handleDialogTypeOpen} />
      </Grid>
      <MainDialog
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        closeModal={closeModal}
      />
    </Grid>
  )
};

export default FamilyList;
