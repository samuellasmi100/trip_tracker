import React from "react";
import MainDialogView from "./MainDialog.view";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useStyles } from "./MainDialog.style";
import * as budgetSlice from "../../../../../../store/slice/budgetSlice"
import BudgetManager from "../BudgetManager/BudgetManager"
import ForecastManager from "../ForecastManager/ForecastManager"

const MainDialog = (props) => {
  const dialogType = useSelector((state) => state.budgetSlice.type);
  const dispatch = useDispatch()
  const classes = useStyles();
  const activeButton = useSelector((state) => state.budgetSlice.activeButton)
  const isExpense = useSelector((state) => state.budgetSlice.isExpense)

  const handleDataView = () => {
    return <ForecastManager />
  };


    
  const { dialogOpen,closeModal } = props;

  return (
    <MainDialogView
    dialogOpen={dialogOpen}
    closeModal={closeModal}
    handleDataView={handleDataView}
    />
  );
};

export default MainDialog;
