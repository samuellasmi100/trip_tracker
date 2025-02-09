import React, { useEffect } from "react";
import ExpensesAndIncomeView from "./ExpensesAndIncome.view";
import ApiBudgets from "../../../../../apis/budgetsRequest";
import * as budgetSlice from "../../../../../store/slice/budgetSlice";
import { useDispatch, useSelector } from "react-redux";

const ExpensesAndIncome = ({ handleDialogTypeOpen }) => {
  const token = sessionStorage.getItem("token");
  const dispatch = useDispatch();
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const isExpense = useSelector((state) => state.budgetSlice.isExpense)

  const getExpenses = async () => { 
    try {
      if(isExpense){
        const response = await ApiBudgets.getExpenses(token, vacationId);
        dispatch(budgetSlice.updateExpensesAndIncome(response.data));
        }else {
        dispatch(budgetSlice.updateExpensesAndIncome([]));
        }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getExpenses();
  }, [vacationId,isExpense]);

  return <ExpensesAndIncomeView handleDialogTypeOpen={handleDialogTypeOpen} />;
};

export default ExpensesAndIncome;
