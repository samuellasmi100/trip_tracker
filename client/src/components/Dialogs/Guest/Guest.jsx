import React, { useEffect, useState } from "react";
import ApiUser from "../../../apis/userRequest";
import { useSelector } from "react-redux";
import GuestView from "./Guest.view";


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
    identitId:'',
    numberOfGuests:"",
    numberOfRooms:"",
    totalAmount:"",
    includesFlight:false,
    parentId:"0"
  })

  const areaCodes = ["052", "053", "054", "058"]
  const handleButtonString = () =>{
  if(dialogType === "new"){
  return "הוסף אורח"
  }else if(dialogType === "edit"){
  return "עדכן אורח"
  }else if(dialogType === "child"){
    return "הוסף בן משפחה"
  }
  }

  useEffect(() => {
    if (userDetails && dialogType !== "child") {
      setForm(prevForm => ({
        ...prevForm,
        firstName: userDetails.name || prevForm.firstName,
        lastName: userDetails.lastName || prevForm.lastName,
        email: userDetails.email || prevForm.email,
        phoneA: userDetails.phoneA || prevForm.phoneA,
        phoneB: userDetails.phoneB || prevForm.phoneB,
        identitId: userDetails.identitId || prevForm.identitId,
        numberOfGuests: userDetails.numberOfGuests || prevForm.numberOfGuests,
        numberOfRooms: userDetails.numberOfRooms || prevForm.numberOfRooms,
        totalAmount: userDetails.totalAmount || prevForm.totalAmount.replace(/,/g, ""),
        includesFlight: userDetails.flights === 1 ? true : prevForm.includesFlight
      }));
    }else {
      setForm(prevForm => ({...prevForm,parentId:userDetails.parent_id})) 
    }
  }, []);

  const submit = () => {
    try {
      if(dialogType === "child"){
        const response = ApiUser.createChildUser(form)

      }else {
        const response = ApiUser.createParantUser(form)
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
