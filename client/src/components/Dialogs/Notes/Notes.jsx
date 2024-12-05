import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NotesView from "./Notes.view";
import * as notesSlice from "../../../store/slice/notesSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import * as userSlice from "../../../store/slice/userSlice";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";

import ApiNotes from "../../../apis/notesRequest"

const Notes = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.notesSlice.form);
  const userForm = useSelector((state) => state.userSlice.form);
 const token = sessionStorage.getItem("token")
const vacationId =  useSelector((state) => state.vacationSlice.vacationId)


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(notesSlice.updateFormField({ field: name, value }));
    dispatch(notesSlice.updateFormField({ field: "family_id",value:userForm.family_id }))
    dispatch(notesSlice.updateFormField({ field: "user_id",value:userForm.user_id }))
  
  };

  const submit = async () => {
    try {
       await ApiNotes.addNotes(token,form,vacationId)
       dispatch(
        snackBarSlice.setSnackBar({
          type: "success",
          message: "הערות עודכנו בהצלחה",
          timeout: 3000,
        })
        )
    } catch (error) {
      console.log(error);
    }
  };
;
const handleCloseClicked = () => {
  dispatch(userSlice.resetForm())
  dispatch(notesSlice.resetForm())
 dispatch(dialogSlice.resetState())
 }
  return <NotesView handleInputChange={handleInputChange} submit={submit}  handleCloseClicked={handleCloseClicked}/>;
};

export default Notes;
