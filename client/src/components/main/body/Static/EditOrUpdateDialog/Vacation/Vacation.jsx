import React, { useEffect } from "react";
import VacationsView from "./Vacation.view";
import { useDispatch, useSelector } from "react-redux";
import * as staticSlice from "../../../../../../store/slice/staticSlice"
import ApiVacations from "../../../../../../apis/vacationRequest"

const Vacation = () => {
  const dispatch = useDispatch()
  const token = sessionStorage.getItem("token")
  const form = useSelector((state) => state.staticSlice.form)
  
 const handleInputChange = (eventOrValue, fieldName) => {

    if (typeof eventOrValue === "object" && eventOrValue.target) {
      const { name, value } = eventOrValue.target;
      dispatch(staticSlice.updateFormField({ field: name, value }));
    } else {
      dispatch(
        staticSlice.updateFormField({ field: fieldName, value: eventOrValue })
      );
    }
  };

  const submit = async () => {
    try {
      const response = await ApiVacations.addVacation(token, form);
      // dispatch(staticSlice.closeMainModal());
    } catch (error) {}
  }

  return <VacationsView  handleInputChange={handleInputChange} submit={submit} />;
};

export default Vacation;
