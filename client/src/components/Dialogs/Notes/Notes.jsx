import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NotesView from "./Notes.view";
import * as notesSlice from "../../../store/slice/notesSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import axios from "axios";
import ApiNotes from "../../../apis/notesRequest"

const Notes = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.notesSlice.form);
  const userForm = useSelector((state) => state.userSlice.form);
 const token = sessionStorage.getItem("token")

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(notesSlice.updateFormField({ field: name, value }));
    dispatch(notesSlice.updateFormField({ field: "family_id",value:userForm.family_id }))
    dispatch(notesSlice.updateFormField({ field: "user_id",value:userForm.user_id }))
  
  };

  const submit = async () => {
    try {
       await ApiNotes.addNotes(token,form)
      dispatch(dialogSlice.closeModal());
      dispatch(notesSlice.resetForm());
      dispatch(dialogSlice.initialActiveButton());
      dispatch(dialogSlice.initialDialogType());
    } catch (error) {
      console.log(error);
    }
  };
;

  return <NotesView handleInputChange={handleInputChange} submit={submit} />;
};

export default Notes;
