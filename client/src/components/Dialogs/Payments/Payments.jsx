import React, { useEffect } from "react";
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
  const { name, value,checked } = e.target;
  if(name !== "amount" && name !== "remainsToBePaid"){
    if(name === "invoice"){
      let value = checked
      dispatch(paymentsSlice.updateFormField({ field: "invoice", value: value}));
    }else {
      if(name === "paymentDate"){
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
    
        if (selectedDate < today) {
          dispatch(
            snackBarSlice.setSnackBar({
              type: "warn",
              message: "תאריך התשלום שבחרת הוא תאריך שעבר",
              timeout: 3000,
            })
          )
        }
      }
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
      dispatch(paymentsSlice.resetForm())
      dispatch(dialogSlice.updateActiveButton("הערות"))
    
  } catch (error) {
    console.log(error)
  }
}

const getPayments = async () => {
try {
  const familyId = userForm.family_id;
  let response = await ApiPayments.getPayments(token,familyId,vacationId)
  if(response.data.length > 0){
    dispatch(paymentsSlice.updateFormField({ field: "remainsToBePaid", value: response.data[0].remainsToBePaid }));
    dispatch(paymentsSlice.updateFormField({ field: "invoice", value: response?.data[0].invoice }));
  }else {
    dispatch(paymentsSlice.updateFormField({ field: "invoice", value: false}));
    dispatch(paymentsSlice.updateFormField({ field: "remainsToBePaid", value: userForm.total_amount }));
  }
  dispatch(paymentsSlice.updateFormField({ field: "amount", value: userForm.total_amount }));
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
