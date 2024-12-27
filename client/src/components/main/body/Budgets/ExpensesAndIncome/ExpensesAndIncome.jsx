import React, { useEffect } from "react";
import ExpensesAndIncomeView from "./ExpensesAndIncome.view";



const ExpensesAndIncome = ({handleDialogTypeOpen}) => {
  return <ExpensesAndIncomeView  handleDialogTypeOpen={handleDialogTypeOpen} />;
};

export default ExpensesAndIncome;
