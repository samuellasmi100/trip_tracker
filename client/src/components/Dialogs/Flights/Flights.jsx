import React, { useEffect, useState } from "react";
import FlightsView from "./Flights.view";
import { useDispatch, useSelector } from "react-redux";
import * as flightsSlice from "../../../store/slice/flightsSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"
import * as snackBarSlice from "../../../store/slice/snackbarSlice"
import * as userSlice from "../../../store/slice/userSlice"
import axios from "axios";

const Flights = (props) => {
const dispatch = useDispatch()
  const {
    closeModal,
  } = props;
  const userDetails = useSelector((state) => state.userSlice.parent)

  const form = useSelector((state) => state.flightsSlice.form)
  const handleInputChange = (e) => {
    const { name, value } = e.target
    const parentId = userDetails.parentId
    dispatch(flightsSlice.updateFormField({ field: name, value }))
    dispatch(flightsSlice.updateFormField({ field: "parentId",value:parentId }))
    if (name === "birthDate") {
      const age = calculateAge(value);
      dispatch(flightsSlice.updateFormField({ field: "age", value: age }));
    }
  };

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
      const parentId = userDetails.parentId
     if(form.type === "edit"){
      let response = await axios.put(`http://localhost:5000/flights/${parentId}`,form)
      dispatch(
        snackBarSlice.setSnackBar({
          type: "success",
          message: response.data,
          timeout: 3000,
        })
      );
     }else {
      let response = await axios.post("http://localhost:5000/flights",form)
      dispatch(
        snackBarSlice.setSnackBar({
          type: "success",
          message: response.data,
          timeout: 3000,
        })
      );
     }
     dispatch(dialogSlice.closeModal())
    } catch (error) {
      console.log(error)
    }

  }

  const getParentData = async () => {
    const parentId = userDetails.parentId
    try {
      let response = await axios.get(`http://localhost:5000/flights/${parentId}`)
      response.data[0].type = "edit"
       dispatch(flightsSlice.updateForm(response.data[0]))
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    getParentData()
  }, [])
  
  return (
    <FlightsView closeModal={closeModal} handleInputChange={handleInputChange} submit={submit}/>
  );
};

export default Flights;
