import React, { useEffect, useState } from "react";
import PaymentsView from "./Payments.view"
import { useDispatch, useSelector } from "react-redux";
import * as paymentsSlice from "../../../store/slice/paymentsSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"
import * as snackBarSlice from "../../../store/slice/snackbarSlice";
import ApiPayments from "../../../apis/paymentsRequest"
import * as userSlice from "../../../store/slice/userSlice";

const Payments = () => {
const dispatch = useDispatch()
const form = useSelector((state) => state.paymentsSlice.form)
const userForm = useSelector((state) => state.userSlice.form)
const token = sessionStorage.getItem("token")
const vacationId =  useSelector((state) => state.vacationSlice.vacationId)

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
  dispatch(paymentsSlice.updateFormField({ field: "userId", value: userForm.user_id }));
};

const submit = async () => {
  try {
    await ApiPayments.addPayments(token,form,vacationId)
    dispatch(
      snackBarSlice.setSnackBar({
        type: "success",
        message: "נתוני תשלום עודכנו בהצלחה",
        timeout: 3000,
      })
    )
  } catch (error) {
    console.log(error)
  }
}

const getPayments = async () => {
try {
  const familyId = userForm.family_id;
  let response = await ApiPayments.getPayments(token,familyId,vacationId)
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
const handleCloseClicked = () => {
  dispatch(paymentsSlice.resetForm())
 dispatch(dialogSlice.resetState())
 dispatch(userSlice.resetForm())
 }
useEffect(() => {
  getPayments()
}, [])

  return (
    <PaymentsView handleInputChange={handleInputChange} submit={submit}  handleCloseClicked={handleCloseClicked}/>
  );
};

export default Payments;
