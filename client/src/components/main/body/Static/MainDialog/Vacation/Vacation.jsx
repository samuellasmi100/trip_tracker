import React, { useState } from "react";
import VacationView from "./Vacation.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice"
import * as roomsSlice from "../../../../../../store/slice/roomsSlice"
import { useSelector,useDispatch } from "react-redux";
import ApiRooms from "../../../../../../apis/roomsRequest"

const Vacation = (props) => {
const dispatch = useDispatch()
 const form = useSelector((state) => state.staticSlice.form)
 const token = sessionStorage.getItem("token")

   const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(staticSlice.updateFormField({ field: name, value }));

  };

  const submit = async() => {
    console.log(form)
  try {
   
  } catch (error) {
    console.log(error)
  }
  } 
  return <VacationView handleInputChange={handleInputChange} submit={submit}/>;
};

export default Vacation;
