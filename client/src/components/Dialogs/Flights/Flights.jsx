import React, { useEffect, useState } from "react";
import FlightsView from "./Flights.view";
import { useDispatch, useSelector } from "react-redux";
import * as flightsSlice from "../../../store/slice/flightsSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"
import * as snackBarSlice from "../../../store/slice/snackbarSlice"
import * as userSlice from "../../../store/slice/userSlice"
import axios from "axios";

const Flights = () => {
const dispatch = useDispatch()
  const userType = useSelector((state) => state.userSlice.userType)
  const parentDetails = useSelector((state) => state.userSlice.parent)
  const childDetails = useSelector((state) => state.userSlice.child)
   const dialogType = useSelector((state) =>state.dialogSlice.type)
  const form = useSelector((state) => state.flightsSlice.form)
  const userForm = useSelector((state) => state.userSlice.form)


  const handleInputChange = (e) => {
    console.log(form)
    let { name, value,checked } = e.target
    if (name === "birth_date") {
      const age = calculateAge(value);
      dispatch(flightsSlice.updateFormField({ field: "age", value: age }));
    }
    else if(name === "return_flight_date"){
     const calculate = calculateAgeByFlightDate(form.birth_date,form.return_flight_date)
     if(calculate > form.age){
      dispatch(flightsSlice.updateFormField({ field: "age", value: calculate }));
     }
    }
    else if(name === "is_source_user"){
      value = checked
     dispatch(flightsSlice.updateFormField({ field: name, value:value }))
    }else {
      dispatch(flightsSlice.updateFormField({ field: name, value }))
    }

    dispatch(flightsSlice.updateFormField({ field: "family_id",value:userForm.family_id }))
    dispatch(flightsSlice.updateFormField({ field: "user_id",value:userForm.user_id}))
 
  };

  const calculateAgeByFlightDate = (birth_date,return_flight_date) => {
    let birthDate = new Date(birth_date);
    let returnDate = new Date(return_flight_date);
    
    let age = returnDate.getFullYear() - birthDate.getFullYear();
    
    if (
        returnDate.getMonth() < birthDate.getMonth() || 
        (returnDate.getMonth() === birthDate.getMonth() && returnDate.getDate() < birthDate.getDate())
    ) {
        return age--;
    }else {
      return age
    }
    
  } 

  const calculateAge = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    const isBeforeBirthday = 
      today.getMonth() < birth.getMonth() || 
      (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate());
  
    return isBeforeBirthday ? age - 1 : age;
  };

  const submit = async () => {
    try {
    let response 
    if(form.type === "edit"){
      await axios.put(`http://localhost:5000/flights/${userForm.user_id}`,form)
    }else {
      response = await axios.post("http://localhost:5000/flights",form)
    }
     dispatch(flightsSlice.resetForm())
    dispatch(dialogSlice.initialActiveButton())
    dispatch(dialogSlice.initialDialogType())
    dispatch(dialogSlice.closeModal())
    } catch (error) {
      console.log(error)
    }

  }
  
  const getFlightData = async () => {
    const userId = userForm.user_id
    let familyId = userForm.family_id
    let isInGroup = true
    try {
      let response = await axios.get(`http://localhost:5000/flights/${userId}/${familyId}/${isInGroup}`)
      console.log(response)
      if(response.data.length > 0){
        response.data[0].type = "edit"
        dispatch(flightsSlice.updateForm(response.data[0]))
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getFlightData()
  }, [])
  
  return (
    <FlightsView handleInputChange={handleInputChange} submit={submit}/>
  );
};

export default Flights;
