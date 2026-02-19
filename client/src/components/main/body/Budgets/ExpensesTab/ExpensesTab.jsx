import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as budgetSlice from "../../../../../store/slice/budgetSlice";
import ApiBudgets from "../../../../../apis/budgetsRequest";
import ExpensesTabView from "./ExpensesTab.view";

const ExpensesTab = ({ handleOpenEdit }) => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const expenses = useSelector((state) => state.budgetSlice.expenses);
  const searchTerm = useSelector((state) => state.budgetSlice.searchTerm);
  const statusFilter = useSelector((state) => state.budgetSlice.statusFilter);
  const dialogOpen = useSelector((state) => state.budgetSlice.dialogOpen);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchExpenses = async () => {
    if (!vacationId) return;
    try {
      const response = await ApiBudgets.getExpenses(token, vacationId);
      dispatch(budgetSlice.setExpenses(response.data));
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [vacationId]);

  useEffect(() => {
    if (!dialogOpen) {
      fetchExpenses();
    }
  }, [dialogOpen]);

  const handleDelete = async (actionId) => {
    try {
      await ApiBudgets.deleteExpense(token, vacationId, actionId);
      await fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleStatusToggle = (row) => {
    setSelectedRow(row);
    setConfirmOpen(true);
  };

  const handleConfirmStatus = async () => {
    if (!selectedRow) return;
    try {
      const newStatus = selectedRow.is_paid === 1 ? false : true;
      await ApiBudgets.updateExpensesStatus(token, selectedRow.action_id, newStatus, vacationId);
      await fetchExpenses();
    } catch (error) {
      console.error("Error updating status:", error);
    }
    setConfirmOpen(false);
    setSelectedRow(null);
  };

  const handleCancelStatus = () => {
    setConfirmOpen(false);
    setSelectedRow(null);
  };

  const filteredExpenses = useMemo(() => {
    let result = expenses || [];
    if (searchTerm) {
      result = result.filter(
        (e) =>
          e.categoryName?.includes(searchTerm) ||
          e.subCategoryName?.includes(searchTerm)
      );
    }
    if (statusFilter !== "all") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      result = result.filter((e) => {
        if (statusFilter === "paid") return e.is_paid === 1;
        if (statusFilter === "planned")
          return e.is_paid === 0 && new Date(e.paymentDate0) > today;
        if (statusFilter === "overdue")
          return e.is_paid === 0 && new Date(e.paymentDate0) <= today;
        return true;
      });
    }
    return result;
  }, [expenses, searchTerm, statusFilter]);

  return (
    <ExpensesTabView
      expenses={filteredExpenses}
      handleOpenEdit={handleOpenEdit}
      handleDelete={handleDelete}
      handleStatusToggle={handleStatusToggle}
      confirmOpen={confirmOpen}
      selectedRow={selectedRow}
      handleConfirmStatus={handleConfirmStatus}
      handleCancelStatus={handleCancelStatus}
    />
  );
};

export default ExpensesTab;
