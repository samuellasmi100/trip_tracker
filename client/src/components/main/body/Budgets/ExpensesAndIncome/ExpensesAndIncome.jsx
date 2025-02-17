import React, { useEffect,useState } from "react";
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
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(false)


  const handleClose = () => {
    setOpen(false); 
    setSelectedKey(null); 
  };

  const handleClickOpen = (key,status) => {
    setSelectedKey(key);
    setPaymentStatus(status)
    setOpen(true); 
  };

  const handleConfirm = () => {
    if (selectedKey) {
      handlePaymentStatus(selectedKey); 
    }
    handleClose();
  };
  
  const getExpenses = async () => { 
    try {
      if(budgetStatus === "צפי הוצאות"){
        const response = await ApiBudgets.getExpenses(token, vacationId);
        dispatch(budgetSlice.updateExpensesAndIncome(response.data));
        }else if(budgetStatus === "צפי הכנסות"){
        dispatch(budgetSlice.updateExpensesAndIncome([]));
        }else {
          const response = await ApiBudgets.getExpenses(token, vacationId);
          dispatch(budgetSlice.updateExpensesAndIncome(response.data));
        }
    } catch (error) {
      console.log(error);
    }
  };


  const handlePaymentStatus = async (expenses) => {
   let expensesId = expenses.action_id
    try {
      await ApiBudgets.updateExpensesStatus(token,expensesId,paymentStatus,vacationId,)
      await getExpenses()
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
     getExpenses();
  }, [vacationId,isExpense,budgetStatus]);

  return <ExpensesAndIncomeView 
  handleDialogTypeOpen={handleDialogTypeOpen} 
  handlePaymentStatus={handlePaymentStatus}
  handleClose={handleClose}
   handleConfirm={handleConfirm}
   open={open}
   selectedKey={selectedKey}
   handleClickOpen={handleClickOpen}
  />;
};

export default ExpensesAndIncome;
