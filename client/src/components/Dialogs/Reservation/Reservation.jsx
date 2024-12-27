import React, { useEffect, useState } from "react";
import ReservationView from "./Reservation.view";
import { useDispatch, useSelector } from "react-redux";
import * as userSlice from "../../../store/slice/userSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import * as vacationSlice from "../../../store/slice/vacationSlice";
import ApiUser from "../../../apis/userRequest";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";
import ApiVacations  from "../../../apis/vacationRequest"
import moment from "moment";

const Reservation = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.userSlice.form);
  const userForm = useSelector((state) => state.userSlice.form);
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const familyDetails = useSelector((state) => state.userSlice.family);
  const token = sessionStorage.getItem("token")
  const vacationId =  useSelector((state) => state.vacationSlice.vacationId)
  const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates)

  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    let family_id = form.family_id;

      if (name === "week_chosen") {
    
      const findVacationDateDetails = vacationsDates?.find((key) =>{
        return key.name === value
      })
  
      if(findVacationDateDetails.name !== "חריגים"){
        dispatch(userSlice.updateFormField({ field: "arrival_date", value: findVacationDateDetails.start_date }))
        dispatch(userSlice.updateFormField({ field: "departure_date", value: findVacationDateDetails.end_date }))
        dispatch(userSlice.updateFormField({ field: "week_chosen", value: value}))
        dispatch(userSlice.updateFormField({ field: "date_chosen", value: `${findVacationDateDetails.end_date}/${findVacationDateDetails.start_date }` }))
      }else {
        dispatch(userSlice.updateFormField({ field: "week_chosen", value: value}))
        dispatch(userSlice.updateFormField({ field: "arrival_date", value: ""}))
        dispatch(userSlice.updateFormField({ field: "departure_date", value: ""}))
        dispatch(userSlice.updateFormField({ field: "date_chosen", value: "" }))
      }
    } else if (name === "flights_direction") {
      dispatch(
        userSlice.updateFormField({
          field: "flights_direction",
          value: checked ? e.target.value : "",
        })
      );
    } else if (name === "departure_date") {
      dispatch(userSlice.updateFormField({ field: "departure_date", value:value }))
      dispatch(userSlice.updateFormField({ field: "date_chosen", value: `${value}/${form.arrival_date }` }))
    } else if (
      name === "flights" ||
      name === "flying_with_us" ||
      name === "is_in_group"
    ) {
      value = checked;
      dispatch(userSlice.updateFormField({ field: name, value }));
    } else {
      dispatch(userSlice.updateFormField({ field: name, value }));
    }
    dispatch(
      userSlice.updateFormField({ field: "family_id", value: family_id })
    );
    dispatch(
      userSlice.updateFormField({ field: "userType", value: dialogType })
    );
  };

  const submit = async () => {
    try {

      let response = await ApiUser.updateUser(token,form,vacationId);
      await getGuests();
      dispatch(
        snackBarSlice.setSnackBar({
          type: "success",
          message: "נתוני אורח התעדכנו בהצלחה",
          timeout: 3000,
        })
      )
      if(userForm.user_type === "client"){
      dispatch(dialogSlice.updateActiveButton("בחירת חדרים"))
      }else {
        dispatch(dialogSlice.updateActiveButton("הקצאת חדרים"))

      }

    } catch (error) {
      console.log(error);
    }
  };

  const getGuests = async () => {
  
    let family_id = form.family_id
    try {
      let response = await ApiUser.getUserFamilyList(token,family_id,vacationId)
      if(response.data.length > 0){
        dispatch(userSlice.updateGuets(response.data))
      }else {
        dispatch(userSlice.updateGuets([]))

      }
    } catch (error) {
      console.log(error)
    }
  }

  const getVacations = async () => {
    try {
      const response = await ApiVacations.getVacations(token,vacationId)
      if(response?.data?.vacationsDate?.length > 0){
        dispatch(vacationSlice.updateVacationDatesList(response?.data?.vacationsDate))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseClicked = () => {
    dispatch(userSlice.resetForm())
   dispatch(dialogSlice.resetState())
   dispatch(userSlice.resetForm())
   }

useEffect(() => {
  getVacations()
}, [])

   
  return (
    <ReservationView handleInputChange={handleInputChange} submit={submit}  handleCloseClicked={handleCloseClicked}/>
  );
};

export default Reservation;
