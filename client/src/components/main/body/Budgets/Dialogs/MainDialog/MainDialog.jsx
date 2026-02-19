import React from "react";
import { Dialog } from "@mui/material";
import { useStyles } from "./MainDialog.style";
import ExpenseForm from "../ExpenseForm/ExpenseForm";
import IncomeForm from "../IncomeForm/IncomeForm";
import CategoryManager from "../CategoryManager/CategoryManager";
import BudgetSettings from "../BudgetSettings/BudgetSettings";

const MainDialog = ({ dialogOpen, dialogType, closeModal }) => {
  const classes = useStyles();

  const isLargeDialog = dialogType === "manageCategories";

  const renderContent = () => {
    switch (dialogType) {
      case "addExpense":
      case "editExpense":
        return <ExpenseForm closeModal={closeModal} />;
      case "addIncome":
      case "editIncome":
        return <IncomeForm closeModal={closeModal} />;
      case "manageCategories":
        return <CategoryManager closeModal={closeModal} />;
      case "settings":
        return <BudgetSettings closeModal={closeModal} />;
      default:
        return null;
    }
  };

  return (
    <Dialog
      open={dialogOpen}
      onClose={closeModal}
      classes={{
        paper: `${classes.dialog} ${isLargeDialog ? classes.dialogLarge : classes.dialogSmall}`,
      }}
    >
      {renderContent()}
    </Dialog>
  );
};

export default MainDialog;
