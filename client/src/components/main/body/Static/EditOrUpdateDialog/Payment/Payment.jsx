import React, { useEffect } from "react";
import PaymentView from "./Payment.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice"
import * as paymentsSlice from "../../../../../../store/slice/paymentsSlice"
import { useSelector, useDispatch } from "react-redux";
import ApiPayments from "../../../../../../apis/paymentsRequest"


const Payment = () => {
  const dispatch = useDispatch()
  const form = useSelector((state) => state.staticSlice.form)
  const token = sessionStorage.getItem("token")
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(staticSlice.updateFormField({ field: name, value }));
  };

  const submit = async () => {
    try {
      // const response = await ApiRooms.updateRoom(token,form,vacationId)
      // dispatch(roomsSlice.updateRoomsList(response.data));
      // dispatch(staticSlice.closeDetailsModal());
    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseClicked = () => {
    dispatch(staticSlice.resetState())
    dispatch(staticSlice.closeDetailsModal());
   }

   const getUserPayments = async() => {
    try {

      const response = await ApiPayments.getUserPayments(token,form.user_id,vacationId)
      dispatch(paymentsSlice.updateUserPayments(response.data))
    } catch (error) {
      console.log(error)
    }
   }
useEffect(() => {
  getUserPayments()
}, [])

  return <PaymentView handleInputChange={handleInputChange} submit={submit} handleCloseClicked={handleCloseClicked}/>;
};

export default Payment;