import React, { useEffect, useState } from "react";
import ApiUser from "../../../apis/userRequest";
import GuestView from "./Guest.view";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";
import * as userSlice from "../../../store/slice/userSlice";
import * as paymentsSlice from "../../../store/slice/paymentsSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import { v4 as uuidv4 } from 'uuid';

const Guest = () => {
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const form = useSelector((state) => state.userSlice.form);
  const dispatch = useDispatch();
  const areaCodes = ["052", "053", "054", "058"];
  const familyDetails = useSelector((state) => state.userSlice.family)
  const token = sessionStorage.getItem("token")

  const handleButtonString = () => {
    if (dialogType === "addParent") {
      return "הוסף אורח";
    } else if (dialogType === "editParent") {
      return "עדכן אורח";
    } else if (dialogType === "addChild") {
      return "הוסף בן משפחה";
    }else if (dialogType === "editChild") {
      return  "עדכן בן משפחה"
    }else if (dialogType === "addFamily"){
      return "הוסף משפחה"
    }
  };

  const handleInputChange = (e) => {
    let { name, value,checked } = e.target
    let family_id = familyDetails.family_id
    if(name === "total_amount"){
      const rawValue = value.replace(/,/g, "");
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      dispatch(userSlice.updateFormField({ field: "total_amount",value:formattedValue }))
    }
    else if(name === "flights_direction"){
      dispatch(userSlice.updateFormField({ field: "flights_direction", value:checked ? e.target.value : "" }))
    }
    else if(name === "flights" || name === "flying_with_us" || name === "is_in_group"){
    value = checked
    dispatch(userSlice.updateFormField({ field: name, value }))
    }else {
      dispatch(userSlice.updateFormField({ field: name, value }))
    }
    dispatch(userSlice.updateFormField({ field: "family_id",value:family_id }))
    dispatch(userSlice.updateFormField({ field: "userType",value:dialogType }))
  };
  
  const submit = async () => {
    try {
      let response
      if (dialogType === "addParent" || dialogType === "addChild" || dialogType === "addFamily") {     
      if(dialogType === "addParent"){
        if(form.identity_id === undefined){
          dispatch(
            snackBarSlice.setSnackBar({
              type: "error",
              message: "מספר תעודת זהות הוא חובה",
              timeout: 3000,
            })
          )
          return
        }else {
          response = await ApiUser.addUser(token,form)
          await getUsers()
          dispatch(userSlice.resetForm())
          dispatch(dialogSlice.resetState())
        }
      }else if(dialogType === "addFamily"){
        if(form.identity_id === undefined || form.identity_id === ""){
          dispatch(
            snackBarSlice.setSnackBar({
              type: "error",
              message: "מספר תעודת זהות הוא חובה",
              timeout: 3000,
            })
          )
          return
        }else {
          const newFamilyId = uuidv4();
          const newUserId = uuidv4();
          response = await ApiUser.addUser(token,form,newFamilyId,newUserId)
          await ApiUser.addFamily(token,form,newFamilyId)
          dispatch(userSlice.updateFormField({ field: "family_id",value:newFamilyId }))
          dispatch(userSlice.updateFormField({ field: "user_id",value:newUserId }))
        }
      }else {
        response = await ApiUser.addUser(token,form)
        await getUsers()
      }
      } else if (dialogType === "editChild" || dialogType === "editParent") {
        if(dialogType === "editParent"){
          if(form.identity_id === undefined || form.identity_id === ""){
            dispatch(
              snackBarSlice.setSnackBar({
                type: "error",
                message: "מספר תעודת זהות הוא חובה",
                timeout: 3000,
              })
            )
            return
          }else {
            response = await ApiUser.updateUser(token,form)
            await getUsers()
          }
        }else {
          response = await ApiUser.updateUser(token,form)
          await getUsers()
        }
       
      }
      dispatch(
        snackBarSlice.setSnackBar({
          type: "success",
          message: "נתוני אורח עודכנו בהצלחה",
          timeout: 3000,
        })
      )
    } catch (error) {
      console.log(error);
    }
  };

 const handleCloseClicked = () => {
  dispatch(userSlice.resetForm())
 dispatch(dialogSlice.resetState())
 }

  const getUsers = async () => {
    let family_id = form.family_id
    try {
      let response = await ApiUser.getUserFamilyList(token,family_id)
      if(response.data.length > 0){
        dispatch(userSlice.updateGuets(response.data))
      }else {
        dispatch(userSlice.updateGuets([]))

      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <GuestView
      submit={submit}
      areaCodes={areaCodes}
      handleButtonString={handleButtonString}
      handleInputChange={handleInputChange}
      handleCloseClicked={handleCloseClicked}
    />
  );
};

export default Guest;
