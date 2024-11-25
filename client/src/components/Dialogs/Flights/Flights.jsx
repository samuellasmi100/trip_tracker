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

  const form = useSelector((state) => state.flightsSlice.form)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let userId 
    if(userType === "parent"){
      userId = parentDetails.parent_id
      dispatch(flightsSlice.updateFormField({ field: "parent_id",value:userId }))
    }else {
     const childId = childDetails.child_id
     const parentId = parentDetails.parent_id
      dispatch(flightsSlice.updateFormField({ field: "child_id",value:childId }))
      dispatch(flightsSlice.updateFormField({ field: "parent_id",value:parentId }))
    }

    dispatch(flightsSlice.updateFormField({ field: name, value }))

    if (name === "birth_date") {
      const age = calculateAge(value);
      dispatch(flightsSlice.updateFormField({ field: "age", value: age }));
    }
    if(name === "return_flight_date"){
     const calculate = calculateAgeByFlightDate(form.birth_date,form.return_flight_date)
     if(calculate > form.age){
      dispatch(flightsSlice.updateFormField({ field: "age", value: calculate }));
     }
    }
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
    let birthDate = new Date(form.birth_date);
    let returnDate = new Date(form.return_flight_date);
    
    // Calculate the difference in years
    let age = returnDate.getFullYear() - birthDate.getFullYear();
    
    // Adjust for partial years
    if (
        returnDate.getMonth() < birthDate.getMonth() || 
        (returnDate.getMonth() === birthDate.getMonth() && returnDate.getDate() < birthDate.getDate())
    ) {
        age--;
    }
    
    console.log(`The difference is ${age} years.`);
    try {
    let response 
     const parentId = parentDetails.parent_id
     if(userType === "parent"){
      if(form.type === "edit"){
        // response = await axios.put(`http://localhost:5000/flights/${parentId}`,form)
        }else {
        //  response = await axios.post("http://localhost:5000/flights",form)
        }
       
     }else {
     const childId = childDetails.child_id
      if(form.type === "edit"){
       response = await axios.put(`http://localhost:5000/flights/child/${childId}`,form)
      }else {
       response = await axios.post(`http://localhost:5000/flights/child`,form)
      }
     }
    //  dispatch(
    //   snackBarSlice.setSnackBar({
    //     type: "success",
    //     message: response.data,
    //     timeout: 3000,
    //   })
    // );
    // dispatch(dialogSlice.initialActiveButton())
    // dispatch(dialogSlice.initialDialogType())
    // dispatch(dialogSlice.closeModal())
    } catch (error) {
      console.log(error)
    }

  }

  const getParentData = async () => {
    const parentId = parentDetails.parent_id
    try {
      let response = await axios.get(`http://localhost:5000/flights/${parentId}`)
      if(response.data.length > 0){
        console.log(response)
        response.data[0].type = "edit"
        dispatch(flightsSlice.updateForm(response.data[0]))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getChildData = async () => {
    const childId= childDetails.child_id
    try {
      let response = await axios.get(`http://localhost:5000/flights/child/${childId}`)
      if(response.data.length > 0){
        response.data[0].type = "edit"
        dispatch(flightsSlice.updateForm(response.data[0]))
      }
      
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    if(userType === "parent"){
      getParentData()
    }else {
      getChildData()
    }
  }, [])
  
  return (
    <FlightsView handleInputChange={handleInputChange} submit={submit}/>
  );
};

export default Flights;
