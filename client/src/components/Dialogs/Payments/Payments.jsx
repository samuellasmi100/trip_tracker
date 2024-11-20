import React, { useEffect, useState } from "react";
import PaymentsView from "./Payments.view"
import { useDispatch, useSelector } from "react-redux";
import * as paymentsSlice from "../../../store/slice/paymentsSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"
import * as userSlice from "../../../store/slice/userSlice"
import axios from "axios";

const Payments = () => {
const dispatch = useDispatch()
const form = useSelector((state) => state.paymentsSlice.form)
const parentDetails = useSelector((state) => state.userSlice.parent)

const handleInputChange = (e) => {
  const { name, value } = e.target;
  const parentId = parentDetails.parent_id;
  const numericValue = value.replace(/[^0-9.]/g, "");
  const formattedValue = new Intl.NumberFormat().format(numericValue);

  if (name === "amount") {
    dispatch(paymentsSlice.updateFormField({ field: "amount", value: formattedValue }));
  } else {
    if(name === "amountReceived"){
     if(value !== ""){
      let result = form.amount.replace(/,/g, "");
      const remainsToBePaid = Number(result) - Number(value)
 
       const numericValue = remainsToBePaid.toString().replace(/[^0-9.]/g, "");
       const formattedValue = new Intl.NumberFormat().format(numericValue);
 
       const numericValue2 = value.replace(/[^0-9.]/g, "");
       const formattedValue2 = new Intl.NumberFormat().format(numericValue2);
 
       dispatch(paymentsSlice.updateFormField({ field: "amountReceived", value: formattedValue2 }));
       dispatch(paymentsSlice.updateFormField({ field: "remainsToBePaid", value: formattedValue  }));
     }else {
      dispatch(paymentsSlice.updateFormField({ field: "remainsToBePaid", value: form.mainRemainsToBePaid }));
     }
     
    }
    dispatch(paymentsSlice.updateFormField({ field: name, value }));
  }
  dispatch(paymentsSlice.updateFormField({ field: "parentId", value: parentId }));
};

const submit = async () => {
  try {
    await axios.post("http://localhost:5000/payments",form)
    dispatch(dialogSlice.closeModal())
    dispatch(dialogSlice.initialActiveButton())
    dispatch(dialogSlice.initialDialogType())
  } catch (error) {
    console.log(error)
  }
}

const getPayments = async () => {
try {
  const parentId = parentDetails.parent_id;
  console.log(parentId)
  let response = await axios.get(`http://localhost:5000/payments/${parentId}`)
  console.log(response)
  if(response.data.length > 0){
    response.data[0].mainRemainsToBePaid = response.data[0].remains_to_be_paid
    dispatch(paymentsSlice.updateForm(response.data[0]));
  }else {
    dispatch(paymentsSlice.updateForm({}));
  }
 
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
