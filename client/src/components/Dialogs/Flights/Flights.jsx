import React, { useEffect, useState } from "react";
import FlightsView from "./Flights.view";
import { useDispatch, useSelector } from "react-redux";
import * as flightsSlice from "../../../store/slice/flightsSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"
import ApiFlights from "../../../apis/flightsRequest"
import * as userSlice from "../../../store/slice/userSlice";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";

const Flights = () => {
const dispatch = useDispatch()
const form = useSelector((state) => state.flightsSlice.form)
const userForm = useSelector((state) => state.userSlice.form)
const token = sessionStorage.getItem("token")
const vacationId =  useSelector((state) => state.vacationSlice.vacationId)
const userClassificationType = ["MR","MRS","BABY"]

  const handleInputChange = (e) => {
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
     dispatch(flightsSlice.updateFormField({ field: name, value }))
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
    let response
    try {
    if(form.type === "edit"){
      response = await ApiFlights.updateUserFligets(token,userForm.user_id,form,vacationId)
      dispatch(flightsSlice.updateFormField({ field: "type", value:"edit"}));
    }else {
      response = await ApiFlights.addUserFlights(token,form,vacationId)
      dispatch(flightsSlice.updateFormField({ field: "type", value:"edit"}));
    }
     dispatch(
      snackBarSlice.setSnackBar({
        type: "success",
        message: "נתוני טיסה עודכנו בהצלחה",
        timeout: 3000,
      })
    )

    } catch (error) {
      console.log(error)
    }

  }
  
  const getFlightData = async () => {

    const userId = userForm.user_id
    let familyId = userForm.family_id
    let isInGroup = userForm.is_in_group
    try {
      let response = await ApiFlights.getUserFlightData(token,userId,familyId,isInGroup,vacationId)

      if(response.data[0].all_flight_data_null === 1){
        dispatch(flightsSlice.updateFormField({ field: "type", value:"add"}));
        dispatch(flightsSlice.updateFormField({ field: "outbound_flight_date", value:response.data[0].arrival_date}));
        dispatch(flightsSlice.updateFormField({ field: "return_flight_date", value:response.data[0].departure_date}));
      }else {
        console.log(response)
        dispatch(flightsSlice.updateForm(response.data[0]))
        dispatch(flightsSlice.updateFormField({ field: "type", value:"edit"}));

      }
      dispatch(flightsSlice.updateFormField({ field: "family_id",value:userForm.family_id }))
      dispatch(flightsSlice.updateFormField({ field: "user_id",value:userForm.user_id}))

    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseClicked = () => {
    dispatch(flightsSlice.resetForm())
   dispatch(dialogSlice.resetState())
   dispatch(userSlice.resetForm())
   }

  useEffect(() => {
    getFlightData()
  }, [])
  
  return (
    <FlightsView handleInputChange={handleInputChange} submit={submit}  handleCloseClicked={handleCloseClicked} userClassificationType={userClassificationType}/>
  );
};

export default Flights;
