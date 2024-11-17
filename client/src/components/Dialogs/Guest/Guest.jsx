import React, { useEffect, useState } from "react";
import ApiUser from "../../../apis/userRequest";
import GuestView from "./Guest.view";
import axios from "axios";
import { useDispatch } from "react-redux";
import * as snackBarSlice from "../../../store/slice/snackbarSlice"

const Guest = (props) => {

  const {
    closeModal,
    userDetails,
    dialogType
  } = props;

  const [form, setForm] = useState({
    firstName:"",
    lastName:"",
    email:"",
    phoneA:"",
    phoneB:"",
    identityId:'',
    numberOfGuests:"",
    numberOfRooms:"",
    totalAmount:"",
    includesFlight:false,
    parentId:"0"
  })
  const dispatch = useDispatch();
  const areaCodes = ["052", "053", "054", "058"]

  const handleButtonString = () =>{
  if(dialogType === "addParent"){
  return "הוסף אורח"
  }else if(dialogType === "editParent"){
  return "עדכן אורח"
  }else if(dialogType === "addChild"){
    return "הוסף בן משפחה"
  }
  }
  useEffect(() => {
    if (userDetails && dialogType !== "addChild") {
      setForm(prevForm => ({
        ...prevForm,
        firstName: userDetails.name || prevForm.firstName,
        lastName: userDetails.lastName || prevForm.lastName,
        email: userDetails.email || prevForm.email,
        phoneA: userDetails.phoneA || prevForm.phoneA,
        phoneB: userDetails.phoneB || prevForm.phoneB,
        identityId: userDetails.identityId || prevForm.identityId,
        numberOfGuests: userDetails.numberOfGuests || prevForm.numberOfGuests,
        numberOfRooms: userDetails.numberOfRooms || prevForm.numberOfRooms,
        totalAmount: userDetails.totalAmount || prevForm.totalAmount.replace(/,/g, ""),
        includesFlight: userDetails.flights === 1 ? true : prevForm.includesFlight,
        parentId:userDetails.parentId || prevForm.parentId,
      }));
    }
    else {
      setForm(prevForm => ({...prevForm,parentId:userDetails.parentId})) 
    }
  }, []);

  const submit = async () => {

    try {
      if(dialogType === "addChild"){
        let response = await axios.post("http://localhost:5000/user/child",form)
        // const response = ApiUser.createChildUser(form)

      }else if(dialogType === "addParent"){
        let response = await axios.get("http://localhost:5000/user",form)
   
      }else if(dialogType === "editParent"){
       
        let response = await axios.put(`http://localhost:5000/user`,form)
        dispatch(
          snackBarSlice.setSnackBar({
            type: "success",
            message: response.data,
            timeout: 3000,
          })
        );
      }else if(dialogType === "editChild"){
        // let response = await axios.get("http://localhost:5000/user",form)
   
      }
      closeModal()
    } catch (error) {
      console.log(error)
    }

  }
  return (
    <GuestView setForm={setForm} form={form} submit={submit} dialogType={dialogType}
    areaCodes={areaCodes} handleButtonString={handleButtonString}/>
  );
};

export default Guest;
