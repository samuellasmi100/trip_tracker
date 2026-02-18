import React, { useState, useEffect, useCallback } from "react";
import MainDialog from "../../../../../Dialogs/MainDialog/MainDialog";
import { useDispatch, useSelector } from "react-redux";
import ApiUser from "../../../../../../apis/userRequest"
import FamilyListView from "./FamilyList.view";
import * as userSlice from "../../../../../../store/slice/userSlice";
import * as dialogSlice from "../../../../../../store/slice/dialogSlice";
import * as flightsSlice from "../../../../../../store/slice/flightsSlice";
import * as roomsSlice from "../../../../../../store/slice/roomsSlice";
import * as notesSlice from "../../../../../../store/slice/notesSlice";
import * as paymentsSlice from "../../../../../../store/slice/paymentsSlice";

const FamilyList = () => {
  const vacationId = useSelector((state) => state.vacationSlice.vacationId)
  const [usersData, setUsersData] = useState([]);
  const dispatch = useDispatch();
  const dialogOpen = useSelector((state) => state.dialogSlice.open)
  const dialogType = useSelector((state) => state.dialogSlice.type)
  const [searchTerm, setSearchTerm] = useState("");
  const token = sessionStorage.getItem('token')
  const chosenFamily = useSelector((state) => state.userSlice.family)

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

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
    // Open drawer when family is clicked
    setDrawerOpen(true);
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

  // Close drawer and modals when vacation changes (dropdown is in Header now)
  useEffect(() => {
    setDrawerOpen(false);
    closeModal();
    clearModalForms();
  }, [vacationId])

  useEffect(() => {
    getFamilies()
    getChosenFamily()
  }, [dialogOpen, vacationId])

  return (
    <>
      <FamilyListView
        handleDialogTypeOpen={handleDialogTypeOpen}
        handleNameClick={handleNameClick}
        filteredFamilyList={filteredFamilyList}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        drawerOpen={drawerOpen}
        closeDrawer={closeDrawer}
      />
      <MainDialog
        dialogType={dialogType}
        dialogOpen={dialogOpen}
        closeModal={closeModal}
      />
    </>
  )
};

export default FamilyList;
