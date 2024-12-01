import React, { useEffect, useState } from "react";
import FlightsView from "./Flights.view";
import { useDispatch, useSelector } from "react-redux";
import * as flightsSlice from "../../../store/slice/flightsSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"
import ApiFlights from "../../../apis/flightsRequest"
import axios from "axios";

const Flights = () => {
const dispatch = useDispatch()
  const form = useSelector((state) => state.flightsSlice.form)
  const userForm = useSelector((state) => state.userSlice.form)
const token = sessionStorage.getItem("token")

  const handleInputChange = (e) => {

    let { name, value,checked } = e.target
    console.log(name,value)
    if (name === "birth_date") {
      const age = calculateAge(value);
      dispatch(flightsSlice.updateFormField({ field: "age", value: age }));
    }
    else if(name === "return_flight_date"){
     const calculate = calculateAgeByFlightDate(form.birth_date,form.return_flight_date)
     if(calculate > form.age){
      dispatch(flightsSlice.updateFormField({ field: "age", value: calculate }));
     }
     dispatch(flightsSlice.updateFormField({ field: name, value }))
    }
    else if(name === "is_source_user"){
      value = checked
      console.log(value)
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
      await ApiFlights.updateUserFligets(token,userForm.user_id,form)
    }else {
      response = await ApiFlights.addUserFlights(token,form)
    }
     dispatch(flightsSlice.resetForm())
     dispatch(dialogSlice.resetState())

    } catch (error) {
      console.log(error)
    }

  }
  
  const getFlightData = async () => {

    const userId = userForm.user_id
    let familyId = userForm.family_id
    let isInGroup = userForm.is_in_group
    try {
      let response = await ApiFlights.getUserFlightData(token,userId,familyId,isInGroup)
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
