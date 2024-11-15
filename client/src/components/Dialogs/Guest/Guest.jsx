import React, { useEffect, useState } from "react";
import ApiUser from "../../../apis/userRequest";
import { useSelector } from "react-redux";
import GuestView from "./Guest.view";


const Guest = (props) => {
const [form, setForm] = useState({
  firstName:"",
  lastNameL:"",
  email:"",
  phoneA:"",
  phoneB:"",
  identitId:'',
  numberOfGuests:"",
  numberOfRooms:"",
  totalAmount:"",
  includesFlight:false
})
  const {
    closeModal,
  } = props;

  const submit = () => {
    try {
      const response = ApiUser.createUser(form)
      closeModal()
    } catch (error) {
      console.log(error)
    }
    console.log(form)
  }
  return (
    <GuestView setForm={setForm} form={form} submit={submit}/>
  );
};

export default Guest;
