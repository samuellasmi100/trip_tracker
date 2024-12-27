import React from "react";
import { useSelector, useDispatch } from "react-redux";
import BudgetManagerView from "./BudgetManager.view";
import * as budgetSlice from "../../../../../../store/slice/budgetSlice";
import ApiBudgets from "../../../../../../apis/budgetsRequest"

const BudgetManager = () => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.budgetSlice.form);
  const token = sessionStorage.getItem("token")
  const vacationId =  useSelector((state) => state.vacationSlice.vacationId)


  const handleInputChange = (e) => {
    const { name, value } = e.target;


  };

  const submit = async () => {
    try {
      //  await ApiBudgets.addNotes(token,form,vacationId)
      //  dispatch(
      //   snackBarSlice.setSnackBar({
      //     type: "success",
      //     message: "הערות עודכנו בהצלחה",
      //     timeout: 3000,
      //   })
      //   )
    } catch (error) {
      console.log(error);
    }
  };
  
const handleCloseClicked = () => {
   dispatch(budgetSlice.resetForm())
   dispatch(budgetSlice.closeModal())

 }

  return <BudgetManagerView handleInputChange={handleInputChange} submit={submit}  handleCloseClicked={handleCloseClicked}/>;
};

export default BudgetManager;
