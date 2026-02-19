import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as budgetSlice from "../../../../../../store/slice/budgetSlice";
import ApiBudgets from "../../../../../../apis/budgetsRequest";
import IncomeFormView from "./IncomeForm.view";

const IncomeForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const form = useSelector((state) => state.budgetSlice.form);
  const dialogType = useSelector((state) => state.budgetSlice.dialogType);
  const incomeCategories = useSelector((state) => state.budgetSlice.incomeCategories);
  const incomeSubCategories = useSelector((state) => state.budgetSlice.incomeSubCategories);

  const isEdit = dialogType === "editIncome";

  useEffect(() => {
    const fetchCategories = async () => {
      if (!vacationId) return;
      try {
        const response = await ApiBudgets.getIncomeCategories(token, vacationId);
        dispatch(budgetSlice.setIncomeCategories(response.data));
      } catch (error) {
        console.error("Error fetching income categories:", error);
      }
    };
    fetchCategories();
  }, [vacationId]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      if (!form.categories || !vacationId) return;
      try {
        const response = await ApiBudgets.getIncomeSubCategories(token, vacationId, form.categories);
        dispatch(budgetSlice.setIncomeSubCategories(response.data));
      } catch (error) {
        console.error("Error fetching income subcategories:", error);
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
        await ApiBudgets.updateIncome(token, form, vacationId);
      } else {
        await ApiBudgets.addIncome(token, form, vacationId);
      }
      closeModal();
    } catch (error) {
      console.error("Error submitting income:", error);
    }
  };

  return (
    <IncomeFormView
      form={form}
      categories={incomeCategories}
      subCategories={incomeSubCategories}
      isEdit={isEdit}
      handleInputChange={handleInputChange}
      submit={submit}
      closeModal={closeModal}
    />
  );
};

export default IncomeForm;
