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
  const budgetStatus = useSelector((state) => state.budgetSlice.status)

  const getExpenses = async () => { 
    console.log(budgetStatus)
    try {
      if(budgetStatus === "צפי הוצאות"){
        console.log("111111111")
        const response = await ApiBudgets.getExpenses(token, vacationId);
        dispatch(budgetSlice.updateExpensesAndIncome(response.data));
        }else if(budgetStatus === "צפי הכנסות"){
          console.log("222222222222")
        dispatch(budgetSlice.updateExpensesAndIncome([]));
        }else {
          const response = await ApiBudgets.getExpenses(token, vacationId);
          dispatch(budgetSlice.updateExpensesAndIncome(response.data));
          console.log("3333333333333333333")
        }
    } catch (error) {
      console.log(error);
    }
  };
  const handlePaymentStatus = async (expenses) => {
    let expensesId = expenses.action_id
    try {
      await ApiBudgets.updateExpensesStatus(token,expensesId,vacationId)
      await getExpenses()
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
     getExpenses();
  }, [vacationId,isExpense,budgetStatus]);

  return <ExpensesAndIncomeView handleDialogTypeOpen={handleDialogTypeOpen} handlePaymentStatus={handlePaymentStatus}/>;
};

export default ExpensesAndIncome;
