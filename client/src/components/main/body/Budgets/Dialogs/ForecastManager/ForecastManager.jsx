import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ForecastManagerView from "./ForecastManager.view";
import * as budgetSlice from "../../../../../../store/slice/budgetSlice";
import ApiBudgets from "../../../../../../apis/budgetsRequest";

const ForecastManager = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.budgetSlice.form);
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const dialogType = useSelector((state) => state.budgetSlice.type);
  const isExpense = useSelector((state) => state.budgetSlice.isExpense);
  const handleInputChange = (eventOrValue, fieldName) => {
    if (typeof eventOrValue === "object" && eventOrValue.target) {
      const { name, value } = eventOrValue.target;
      if (name === "categories") {
        getSubCategories(value);
      }
      dispatch(budgetSlice.updateFormField({ field: name, value }));
    } else {
      dispatch(
        budgetSlice.updateFormField({ field: fieldName, value: eventOrValue })
      );
    }
  };

  const getCategories = async () => {
    try {
      const response = await ApiBudgets.getCategories(token, vacationId);
      dispatch(budgetSlice.updateCategories(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const getSubCategories = async (categoryId) => {
    try {
      const response = await ApiBudgets.getSubCategories(
        token,
        vacationId,
        categoryId
      );
      dispatch(budgetSlice.updateSubCategories(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const submit = async () => {

    try {
      if (isExpense) {
        if (dialogType === "FinancialForecast") {
          await ApiBudgets.addFutureExpenses(token, form, vacationId);
          dispatch(budgetSlice.resetForm());
          await getFutureExpenses();
        }else {
          await ApiBudgets.addExpenses(token, form, vacationId);
          dispatch(budgetSlice.resetForm());
          await getExpenses()
          console.log("else")
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getFutureExpenses = async () => {
    const response = await ApiBudgets.getFutureExpenses(token, vacationId);
    dispatch(budgetSlice.updateExpectedExpensesAndIncome(response.data));
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const getExpenses = async () => {
    const response = await ApiBudgets.getExpenses(token, vacationId);
    dispatch(budgetSlice.updateExpensesAndIncome(response.data));
    try {
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleCloseClicked = () => {
    dispatch(budgetSlice.resetForm());
    dispatch(budgetSlice.closeModal());
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <ForecastManagerView
      handleInputChange={handleInputChange}
      submit={submit}
      handleCloseClicked={handleCloseClicked}
    />
  );
};

export default ForecastManager;
