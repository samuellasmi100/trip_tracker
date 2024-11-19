import React, { useEffect, useState } from "react";
import PaymentsView from "./Payments.view"
import { useDispatch, useSelector } from "react-redux";
import * as paymentsSlice from "../../../store/slice/paymentsSlice"

const Payments = ({userDetails}) => {
const dispatch = useDispatch()
const form = useSelector((state) => state.paymentsSlice.form)

const handleInputChange = (e) => {
  const { name, value } = e.target;
  const parentId = userDetails.parentId;
  const numericValue = value.replace(/[^0-9.]/g, "");
  const formattedValue = new Intl.NumberFormat().format(numericValue);
  if (name === "amount") {
    dispatch(paymentsSlice.updateFormField({ field: "amount", value: formattedValue }));
    // dispatch(paymentsSlice.updateFormField({ field: name, value: value }));
    // dispatch(paymentsSlice.updateFormField({ field: "remainsToBePaid", value: formattedValue }));
  } else {
    if(name === "amountReceived"){
   
     

     let result = form.amount.replace(/,/g, "");
     console.log(result,"fffff")
     const remainsToBePaid = Number(result) - Number(value)
   console.log(remainsToBePaid)
      const numericValue = remainsToBePaid.toString().replace(/[^0-9.]/g, "");
      const formattedValue = new Intl.NumberFormat().format(numericValue);

      const numericValue2 = value.replace(/[^0-9.]/g, "");
      const formattedValue2 = new Intl.NumberFormat().format(numericValue2);
console.log(formattedValue2)
      dispatch(paymentsSlice.updateFormField({ field: "amountReceived", value: formattedValue2 }));
      dispatch(paymentsSlice.updateFormField({ field: "remainsToBePaid", value: formattedValue  }));
    }
    dispatch(paymentsSlice.updateFormField({ field: name, value }));
  }
  dispatch(paymentsSlice.updateFormField({ field: "parentId", value: parentId }));
};
const formatNumberWithCommas = (num) => {
  return num.toLocaleString("en-US"); // Adds commas to the number
};

  return (
    <PaymentsView handleInputChange={handleInputChange}/>
  );
};

export default Payments;
