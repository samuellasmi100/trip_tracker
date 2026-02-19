import React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as budgetSlice from "../../../../store/slice/budgetSlice";
import BudgetsView from "./Budgets.view";

const Budgets = () => {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.budgetSlice.activeTab);
  const dialogOpen = useSelector((state) => state.budgetSlice.dialogOpen);
  const dialogType = useSelector((state) => state.budgetSlice.dialogType);

  const handleTabChange = (event, newValue) => {
    dispatch(budgetSlice.setActiveTab(newValue));
  };

  const handleOpenAdd = () => {
    if (activeTab === 0) dispatch(budgetSlice.openDialog("addExpense"));
    else if (activeTab === 1) dispatch(budgetSlice.openDialog("addIncome"));
  };

  const handleOpenEdit = (data, type) => {
    dispatch(budgetSlice.setForm(data));
    dispatch(budgetSlice.openDialog(type));
  };

  const handleOpenCategories = () => {
    dispatch(budgetSlice.openDialog("manageCategories"));
  };

  const handleOpenSettings = () => {
    dispatch(budgetSlice.openDialog("settings"));
  };

  const closeModal = () => {
    dispatch(budgetSlice.closeDialog());
    dispatch(budgetSlice.resetForm());
  };

  return (
    <BudgetsView
      activeTab={activeTab}
      handleTabChange={handleTabChange}
      handleOpenAdd={handleOpenAdd}
      handleOpenEdit={handleOpenEdit}
      handleOpenCategories={handleOpenCategories}
      handleOpenSettings={handleOpenSettings}
      dialogOpen={dialogOpen}
      dialogType={dialogType}
      closeModal={closeModal}
    />
  );
};

export default Budgets;
