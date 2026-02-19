import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as budgetSlice from "../../../../../../store/slice/budgetSlice";
import ApiBudgets from "../../../../../../apis/budgetsRequest";
import ExpenseFormView from "./ExpenseForm.view";

const ExpenseForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const form = useSelector((state) => state.budgetSlice.form);
  const dialogType = useSelector((state) => state.budgetSlice.dialogType);
  const categories = useSelector((state) => state.budgetSlice.categories);
  const subCategories = useSelector((state) => state.budgetSlice.subCategories);

  const isEdit = dialogType === "editExpense";

  useEffect(() => {
    const fetchCategories = async () => {
      if (!vacationId) return;
      try {
        const response = await ApiBudgets.getCategories(token, vacationId);
        dispatch(budgetSlice.setCategories(response.data));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [vacationId]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!form.categories || !vacationId) return;
      try {
        const response = await ApiBudgets.getSubCategories(token, vacationId, form.categories);
        dispatch(budgetSlice.setSubCategories(response.data));
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubCategories();
  }, [form.categories, vacationId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch(budgetSlice.updateFormField({ field: name, value }));
  };

  const submit = async () => {
    try {
      if (isEdit) {
        // Update both expenses and future_expenses
        await ApiBudgets.updateExpenses(token, form, vacationId);
        await ApiBudgets.updateFutureExpenses(token, form, vacationId);
      } else {
        // Add new: creates both future_expenses and expenses entries
        await ApiBudgets.addFutureExpenses(token, form, vacationId);
      }
      closeModal();
    } catch (error) {
      console.error("Error submitting expense:", error);
    }
  };

  return (
    <ExpenseFormView
      form={form}
      categories={categories}
      subCategories={subCategories}
      isEdit={isEdit}
      handleInputChange={handleInputChange}
      submit={submit}
      closeModal={closeModal}
    />
  );
};

export default ExpenseForm;
