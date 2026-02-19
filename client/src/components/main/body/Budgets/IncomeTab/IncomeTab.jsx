import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as budgetSlice from "../../../../../store/slice/budgetSlice";
import ApiBudgets from "../../../../../apis/budgetsRequest";
import IncomeTabView from "./IncomeTab.view";

const IncomeTab = ({ handleOpenEdit }) => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const income = useSelector((state) => state.budgetSlice.income);
  const searchTerm = useSelector((state) => state.budgetSlice.searchTerm);
  const statusFilter = useSelector((state) => state.budgetSlice.statusFilter);
  const dialogOpen = useSelector((state) => state.budgetSlice.dialogOpen);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const fetchIncome = async () => {
    if (!vacationId) return;
    try {
      const response = await ApiBudgets.getIncome(token, vacationId);
      dispatch(budgetSlice.setIncome(response.data));
    } catch (error) {
      console.error("Error fetching income:", error);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [vacationId]);

  useEffect(() => {
    if (!dialogOpen) {
      fetchIncome();
    }
  }, [dialogOpen]);

  const handleDelete = async (actionId) => {
    try {
      await ApiBudgets.deleteIncome(token, vacationId, actionId);
      await fetchIncome();
    } catch (error) {
      console.error("Error deleting income:", error);
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
      await ApiBudgets.updateIncomeStatus(token, selectedRow.action_id, newStatus, vacationId);
      await fetchIncome();
    } catch (error) {
      console.error("Error updating income status:", error);
    }
    setConfirmOpen(false);
    setSelectedRow(null);
  };

  const handleCancelStatus = () => {
    setConfirmOpen(false);
    setSelectedRow(null);
  };

  const filteredIncome = useMemo(() => {
    let result = income || [];
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
  }, [income, searchTerm, statusFilter]);

  return (
    <IncomeTabView
      income={filteredIncome}
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

export default IncomeTab;
