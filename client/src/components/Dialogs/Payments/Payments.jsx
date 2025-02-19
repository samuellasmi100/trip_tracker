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
  const { name, value, checked,type  } = e.target;
  const paymentIndex = name.split('_')[1]; 
  if (type === "checkbox") {
    dispatch(paymentsSlice.updateFormField({ field: name, value: checked }));
  } else {
    if (name.startsWith("amount_")) {
      dispatch(paymentsSlice.updateFormField({ field: `amountReceived_${paymentIndex}`, value }));
    } else if (name.startsWith("paymentDate_")) {
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
        );
      }
      dispatch(paymentsSlice.updateFormField({ field: `paymentDate_${paymentIndex}`, value }));
    } else if (name.startsWith("formOfPayment_")) {
      dispatch(paymentsSlice.updateFormField({ field: `formOfPayment_${paymentIndex}`, value }));
    } else if (name.startsWith("paymentCurrency_")) {
      dispatch(paymentsSlice.updateFormField({ field: `paymentCurrency_${paymentIndex}`, value }));
    } else {   
       if (name === "invoice") {
        dispatch(paymentsSlice.updateFormField({ field: "invoice", value: checked }));
      } else {
        dispatch(paymentsSlice.updateFormField({ field: name, value }));
      }
    }
  }
  dispatch(paymentsSlice.updateFormField({ field: "familyId", value: userForm.family_id }));
  dispatch(paymentsSlice.updateFormField({ field: "userId", value: userForm.user_id }));
  dispatch(paymentsSlice.updateFormField({ field: "number_of_payments", value: userForm.number_of_payments }));
  dispatch(paymentsSlice.updateFormField({ field: "amount", value: userForm.total_amount }));
};


const submit = async () => {
  try {
    const calculateTotalAmountReceived = (data) => {
      return Object.keys(data)
        .filter((key) => key.startsWith("amountReceived_"))
        .reduce((total, key) => total + parseFloat(data[key] || 0), 0);
    };

    if(Number(calculateTotalAmountReceived(form) > parseInt(form.amount.replace(/,/g, "")))){
       dispatch(
          snackBarSlice.setSnackBar({
            type: "error",
            message: "הסכום שהוזן גדול מסכום העסקה",
            timeout: 3000,
          })
        )
    }else {
      if(calculateTotalAmountReceived(form) < parseInt(form.amount.replace(/,/g, "")) ){
        dispatch(
          snackBarSlice.setSnackBar({
            type: "info",
            message: "הסכום שהוזן קטן מסכום העסקה",
            timeout: 3000,
          })
        )
      }
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
      await getPayments()
    }
     
  } catch (error) {
    console.log(error)
  }
}

const getPayments = async () => {
try {
  const familyId = userForm.family_id;
  let response = await ApiPayments.getPayments(token,familyId,vacationId)
  const renameArr = response?.data?.reduce((acc, payment, index) => {
    acc[`amountReceived_${index + 1}`] = payment.amountReceived;
    acc[`paymentDate_${index + 1}`] = payment.paymentDate;
    acc[`formOfPayment_${index + 1}`] = payment.formOfPayment;
    acc[`paymentCurrency_${index + 1}`] = payment.paymentCurrency;
    acc[`isPaid_${index + 1}`] = payment.is_paid;
    acc[`id_${index + 1}`] = payment.id;
    return acc;
  }, {});
  
  dispatch(paymentsSlice.updateForm(renameArr));
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
