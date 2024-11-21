import React, { useEffect, useState } from "react";
import ApiUser from "../../../apis/userRequest";
import GuestView from "./Guest.view";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";
import * as userSlice from "../../../store/slice/userSlice";
import * as paymentsSlice from "../../../store/slice/paymentsSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";

const Guest = () => {
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const parentDetails = useSelector((state) => state.userSlice.parent);
  const userType = useSelector((state) => state.userSlice.userType)
  const form = useSelector((state) => state.userSlice.form);
  const dispatch = useDispatch();
  const areaCodes = ["052", "053", "054", "058"];
  const childDetails = useSelector((state) => state.userSlice.child)
  

  const handleButtonString = () => {
    if (dialogType === "addParent") {
      return "הוסף אורח";
    } else if (dialogType === "editParent") {
      return "עדכן אורח";
    } else if (dialogType === "addChild") {
      return "הוסף בן משפחה";
    }else if (dialogType === "editChild") {
      return  "עדכן בן משפחה"
    }
  };

  const handleInputChange = (e) => {
    let { name, value,checked } = e.target
    let userId 
    if(userType === "parent"){
      userId = parentDetails.parent_id
      dispatch(userSlice.updateFormField({ field: "parent_id",value:userId }))
    }else {

      userId = childDetails.child_id
      dispatch(userSlice.updateFormField({ field: "child_id",value:userId }))
    }
    if(name === "flights_direction"){
      dispatch(userSlice.updateFormField({ field: "flights_direction", value:checked ? e.target.value : "" }))

    }
    if(name === "flights"){
    value = checked
    dispatch(userSlice.updateFormField({ field: name, value }))
    }else {
      dispatch(userSlice.updateFormField({ field: name, value }))
    }
  };
  
  const submit = async () => {
    try {
      let response
      if (dialogType === "addChild") {
        response = await axios.post("http://localhost:5000/user/child",form);
        dispatch(userSlice.resetForm())
      } else if (dialogType === "addParent") {
        response = await axios.post("http://localhost:5000/user", form);
        dispatch(userSlice.resetForm())
      } else if (dialogType === "editParent") {
        response = await axios.put(`http://localhost:5000/user`, form);
        dispatch(userSlice.resetForm())
      } else if (dialogType === "editChild") {
        response = await axios.put("http://localhost:5000/user/child",form)
        dispatch(userSlice.updateChild({}))
        dispatch(userSlice.updateForm({}))
      }
       dispatch(
          snackBarSlice.setSnackBar({
            type: "success",
            message: response.data,
            timeout: 3000,
          })
        );
     
      dispatch(dialogSlice.closeModal())
      dispatch(dialogSlice.initialActiveButton())
      dispatch(dialogSlice.initialDialogType())
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <GuestView
      submit={submit}
      areaCodes={areaCodes}
      handleButtonString={handleButtonString}
      handleInputChange={handleInputChange}
    />
  );
};

export default Guest;
