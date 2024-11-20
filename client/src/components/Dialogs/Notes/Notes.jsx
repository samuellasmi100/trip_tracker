import React, { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import NotesView from "./Notes.view";
import * as notesSlice from "../../../store/slice/notesSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import axios from "axios";
import * as noteSlice  from "../../../store/slice/notesSlice";

const Notes = () => {
  const userType = useSelector((state) => state.userSlice.userType)
  const childDetails = useSelector((state) => state.userSlice.child)

  const dispatch = useDispatch();
  const form = useSelector((state) => state.notesSlice.form);
  const parentDetails = useSelector((state) => state.userSlice.parent);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let userId 
    if(userType === "parent"){
      userId = parentDetails.parent_id
      dispatch(noteSlice.updateFormField({ field: "parent_id",value:userId }))
    }else {
      const childId = childDetails.child_id
      const parentId = parentDetails.parent_id
      dispatch(noteSlice.updateFormField({ field: "child_id",value:childId }))
      dispatch(noteSlice.updateFormField({ field: "parent_id",value:parentId }))

    }
    dispatch(notesSlice.updateFormField({ field: name, value }));
  
  };

  const submit = async () => {
    try {
      if(userType === "parent"){
        let response = await axios.post(`http://localhost:5000/notes`, form);
      }else {
        let response = await axios.post(`http://localhost:5000/notes/child`, form);

      }
      dispatch(dialogSlice.closeModal());
      dispatch(notesSlice.resetForm());
      dispatch(dialogSlice.initialActiveButton());
      dispatch(dialogSlice.initialDialogType());
    } catch (error) {
      console.log(error);
    }
  };

  // const getParentNote = async () => {
  //   const parentId = parentDetails.parentId;
  //   try {
  //     let response = await axios.get(`http://localhost:5000/notes/${parentId}`);
  //     console.log(response)
  //     dispatch(notesSlice.updateForm(response.data[0]))
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  // useEffect(() => {
  //   getParentNote();
  // }, []);

  return <NotesView handleInputChange={handleInputChange} submit={submit} />;
};

export default Notes;
