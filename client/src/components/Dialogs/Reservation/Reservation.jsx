import React, { useEffect, useState } from "react";
import ReservationView from "./Reservation.view";
import { useDispatch, useSelector } from "react-redux";
import * as userSlice from "../../../store/slice/userSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import ApiUser from "../../../apis/userRequest";
import * as snackBarSlice from "../../../store/slice/snackbarSlice";


const Reservation = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.userSlice.form);
  const userForm = useSelector((state) => state.userSlice.form);
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const familyDetails = useSelector((state) => state.userSlice.family);
  const token = sessionStorage.getItem("token")
  const vacationId =  useSelector((state) => state.vacationSlice.vacationId)

  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    let family_id = form.family_id;
    if (name === "total_amount") {
      const rawValue = value.replace(/,/g, "");
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      dispatch(
        userSlice.updateFormField({
          field: "total_amount",
          value: formattedValue,
        })
      );
    } else if (name === "flights_direction") {
      dispatch(
        userSlice.updateFormField({
          field: "flights_direction",
          value: checked ? e.target.value : "",
        })
      );
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

  const handleCloseClicked = () => {
    dispatch(userSlice.resetForm())
   dispatch(dialogSlice.resetState())
   dispatch(userSlice.resetForm())
   }

   
  return (
    <ReservationView handleInputChange={handleInputChange} submit={submit}  handleCloseClicked={handleCloseClicked}/>
  );
};

export default Reservation;
