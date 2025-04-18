
import BudgetsView from "./Budgets.view";
import * as budgetSlice from "../../../../store/slice/budgetSlice"
import { useDispatch, useSelector } from "react-redux";
import MainDialog from "./Dialogs/MainDialog/MainDialog"
import Overview from "./Overview/Overview"
import React from "react";

const Budgets = () => {
  const isExpense = useSelector((state) => state.budgetSlice.isExpense)
  const dispatch = useDispatch()
  const dialogOpen = useSelector((state) => state.budgetSlice.open)
  const dialogType = useSelector((state) => state.budgetSlice.type)
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = (option) => {
    if (option) {
      dispatch(budgetSlice.updateStatus(option))
    }
    setAnchorEl(null);
  };

  const handleToggle = (event) => {
    dispatch(budgetSlice.updateIncomeOrExpense(event.target.checked))
  };

  const closeModal = () => {
    dispatch(budgetSlice.closeModal())
    dispatch(budgetSlice.resetForm())
  };

  const handleDialogTypeOpen = (type, data) => {
    if (data !== undefined) {
      dispatch(budgetSlice.updateForm(data))
    }
    dispatch(budgetSlice.updateDialogType(type))
    if (type === "FinancialForecast" || isExpense && type === "updateFinancialForecast") {
      dispatch(budgetSlice.openModal())
    } else if (type === "ExpensesAndIncomeView" || type === "updateExpense") {
      dispatch(budgetSlice.openModal())
    }

  };
  
  return (

    <BudgetsView
      handleToggle={handleToggle}
      dialogOpen={dialogOpen}
      dialogType={dialogType}
      handleDialogTypeOpen={handleDialogTypeOpen}
      closeModal={closeModal}
      anchorEl={anchorEl}
      open={open}
      handleClick={handleClick}
      handleClose={handleClose}
    />
  )
};

export default Budgets;
