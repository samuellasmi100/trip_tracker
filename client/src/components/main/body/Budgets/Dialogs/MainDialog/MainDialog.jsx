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
   if(activeButton === "צפי תקציב"){
    return <BudgetManager />
   }else if(activeButton === "הוסף הוצאה עתידית"){
    return <ForecastManager />
   }
  };

  const handleButtonClick = (buttonName) => {
    dispatch(budgetSlice.updateActiveButton(buttonName))
  }

  const handleButtonHeader = () => {
        return(
          [isExpense ? "הוסף הוצאה עתידית" : "הוסף הכנסה עתידית"]
          .map((label) => (
            <Button
              key={label}
              className={`${classes.navButton} ${activeButton === label ? "active" : ""}`}
              onClick={() => handleButtonClick(label)}>
              {label}
            </Button>
          ))
        )
  }
    
  const { dialogOpen,closeModal } = props;

  return (
    <MainDialogView
    dialogOpen={dialogOpen}
    closeModal={closeModal}
    handleDataView={handleDataView}
     handleButtonHeader={handleButtonHeader}
    />
  );
};

export default MainDialog;
