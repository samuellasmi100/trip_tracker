import React, { useEffect, useState } from "react";
import PaymentsView from "./Payments.view"
import { useDispatch, useSelector } from "react-redux";
import * as paymentsSlice from "../../../store/slice/paymentsSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"
import axios from "axios";
import ApiPayments from "../../../apis/paymentsRequest"
import { Token } from "@mui/icons-material";

const Payments = () => {
const dispatch = useDispatch()
const form = useSelector((state) => state.paymentsSlice.form)
const userForm = useSelector((state) => state.userSlice.form)
const token = sessionStorage.getItem("token")
const handleInputChange = (e) => {
  const { name, value } = e.target;
  const numericValue = value.replace(/[^0-9.]/g, "");
  const formattedValue = new Intl.NumberFormat().format(numericValue);

  if (name === "amount") {
    dispatch(paymentsSlice.updateFormField({ field: "amount", value: formattedValue }));
  } else {
    if(name === "amountReceived"){
      const rawValue = value.toString().replace(/,/g, "");
      const formattedValue = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      dispatch(paymentsSlice.updateFormField({ field: "amountReceived", value:formattedValue}))
     
    }else {
    dispatch(paymentsSlice.updateFormField({ field: name, value }));

    }
  }
  dispatch(paymentsSlice.updateFormField({ field: "familyId", value: userForm.family_id }));
};

const submit = async () => {
  try {
    await ApiPayments.addPayments(token,form)
    dispatch(dialogSlice.closeModal())
    dispatch(dialogSlice.initialActiveButton())
    dispatch(dialogSlice.initialDialogType())
  } catch (error) {
    console.log(error)
  }
}

const getPayments = async () => {
try {
  const familyId = userForm.family_id;
  let response = await ApiPayments.getPayments(token,familyId)
  if(response.data.length > 0){
    response.data[0].mainRemainsToBePaid = response.data[0].remains_to_be_paid
    dispatch(paymentsSlice.updateForm(response.data[0]));
  }
  dispatch(paymentsSlice.updateFormField({ field: "amount", value: userForm.total_amount }));
  dispatch(paymentsSlice.updateFormField({ field: "amountReceived", value: "" }));
} catch (error) {
  console.log(error)
}
}
useEffect(() => {
  getPayments()
}, [])

  return (
    <PaymentsView handleInputChange={handleInputChange} submit={submit}/>
  );
};

export default Payments;
