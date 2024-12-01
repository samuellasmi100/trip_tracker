import React, { useEffect, useState } from "react";
import ReservationView from "./Reservation.view";
import { useDispatch, useSelector } from "react-redux";
import * as userSlice from "../../../store/slice/userSlice";
import * as dialogSlice from "../../../store/slice/dialogSlice";
import moment from "moment";
import axios from "axios";

const Reservation = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.userSlice.form);
  const userForm = useSelector((state) => state.userSlice.form);
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const familyDetails = useSelector((state) => state.userSlice.family);

  const handleInputChange = (e) => {
    let { name, value, checked } = e.target;
    let family_id = familyDetails.family_id;
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
      let response = await axios.put(`${process.env.REACT_APP_SERVER_BASE_URL}/user/`, form);
      await getGuests();
      dispatch(userSlice.updateChild({}));
      dispatch(userSlice.updateForm({}));
      dispatch(dialogSlice.closeModal());
      dispatch(dialogSlice.initialActiveButton());
      dispatch(dialogSlice.initialDialogType());
    } catch (error) {
      console.log(error);
    }
  };

  const getGuests = async () => {
    let family_id = form.family_id
    try {
      let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/user/${family_id}`)
      if(response.data.length > 0){
        dispatch(userSlice.updateGuets(response.data))
      }else {
        dispatch(userSlice.updateGuets([]))

      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <ReservationView handleInputChange={handleInputChange} submit={submit} />
  );
};

export default Reservation;
