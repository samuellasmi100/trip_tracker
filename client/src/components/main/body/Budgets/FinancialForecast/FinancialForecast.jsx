import React, { useEffect } from "react";
import FinancialForecastView from "./FinancialForecast.view";
import ApiBudget from "../../../../../apis/budgetsRequest";
import ApiVacations from "../../../../../apis/vacationRequest";
import * as budgetSlice from "../../../../../store/slice/budgetSlice";
import * as userSlice from "../../../../../store/slice/userSlice";
import * as vacationSlice from "../../../../../store/slice/vacationSlice";
import * as flightsSlice from "../../../../../store/slice/flightsSlice";
import * as paymentsSlice from "../../../../../store/slice/paymentsSlice";
import * as notesSlice from "../../../../../store/slice/notesSlice";
import * as roomsSlice from "../../../../../store/slice/roomsSlice";
import { useDispatch, useSelector } from "react-redux";

const FinancialForecast = ({ handleDialogTypeOpen }) => {
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const vacationList = useSelector((state) => state.vacationSlice.vacations);
  const isExpense = useSelector((state) => state.budgetSlice.isExpense)
  const budgetStatus = useSelector((state) => state.budgetSlice.status)

  const handleSelectInputChange = async (e) => {
      clearModalForms();
      dispatch(userSlice.updateFamiliesList([]));
      dispatch(userSlice.updateGuest([]));
      const getVacationId = vacationList?.find((key) => {
        return key.name === e.target.value;
      });
      dispatch(vacationSlice.updateChosenVacation(getVacationId.vacation_id));
      dispatch(vacationSlice.updateVacationName(getVacationId.name));
      sessionStorage.setItem("vacId", getVacationId.vacation_id);
      sessionStorage.setItem("vacName", getVacationId.name);
  };

  const clearModalForms = () => {
    dispatch(userSlice.resetForm());
    dispatch(flightsSlice.resetForm());
    dispatch(roomsSlice.resetForm());
    dispatch(notesSlice.resetForm());
    dispatch(paymentsSlice.resetForm());
  };

  const getFutureExpenses = async () => {
    try {
      if(budgetStatus === "צפי הוצאות"){
        const response = await ApiBudget.getFutureExpenses(token, vacationId);
        dispatch(budgetSlice.updateExpectedExpensesAndIncome(response.data));
      }else if(budgetStatus === "צפי הכנסות"){
        // const response = await ApiBudget.getFutureIncomes(token, vacationId);
        dispatch(budgetSlice.updateExpectedExpensesAndIncome([]));
      }else {
        dispatch(budgetSlice.updateExpectedExpensesAndIncome([]));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getVacations = async () => {
    try {
      const response = await ApiVacations.getVacations(token);
      if (response?.data?.vacations?.length > 0) {
        dispatch(vacationSlice.updateVacationList(response?.data?.vacations));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getFutureExpenses();
    getVacations();
  }, [vacationId,isExpense,budgetStatus]);

  return (
    <FinancialForecastView
      handleDialogTypeOpen={handleDialogTypeOpen}
      handleSelectInputChange={handleSelectInputChange}
    />
  );
};

export default FinancialForecast;
