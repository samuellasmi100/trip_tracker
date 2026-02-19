import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as budgetSlice from "../../../../../store/slice/budgetSlice";
import ApiBudgets from "../../../../../apis/budgetsRequest";
import SummaryTabView from "./SummaryTab.view";

const SummaryTab = () => {
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);

  useEffect(() => {
    const fetchData = async () => {
      if (!vacationId) return;
      try {
        const [summaryRes, expensesRes, incomeRes] = await Promise.all([
          ApiBudgets.getSummary(token, vacationId),
          ApiBudgets.getExpenses(token, vacationId),
          ApiBudgets.getIncome(token, vacationId),
        ]);
        dispatch(budgetSlice.setSummary(summaryRes.data));
        dispatch(budgetSlice.setExpenses(expensesRes.data));
        dispatch(budgetSlice.setIncome(incomeRes.data));
      } catch (error) {
        console.error("Error fetching summary data:", error);
      }
    };
    fetchData();
  }, [vacationId]);

  return <SummaryTabView />;
};

export default SummaryTab;
