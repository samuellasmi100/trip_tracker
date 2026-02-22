import React, { useState, useEffect } from "react";
import PaymentView from "./Payment.view";
import * as staticSlice from "../../../../../../store/slice/staticSlice";
import { useSelector, useDispatch } from "react-redux";
import ApiPayments from "../../../../../../apis/paymentsRequest";

const Payment = () => {
  const dispatch    = useDispatch();
  const form        = useSelector((state) => state.staticSlice.form);
  const token       = sessionStorage.getItem("token");
  const vacationId  = useSelector((state) => state.vacationSlice.vacationId);
  const [userPayments, setUserPayments] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(staticSlice.updateFormField({ field: name, value }));
  };

  const submit = async () => {
    try {
      // placeholder — handled via PaymentDialog now
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseClicked = () => {
    dispatch(staticSlice.resetState());
    dispatch(staticSlice.closeDetailsModal());
  };

  const getPayments = async () => {
    try {
      if (!form?.familyId || !vacationId) return;
      const response = await ApiPayments.getPayments(token, vacationId, form.familyId);
      setUserPayments(response.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaymentView
      handleInputChange={handleInputChange}
      submit={submit}
      handleCloseClicked={handleCloseClicked}
      userPayments={userPayments}
    />
  );
};

export default Payment;
