import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useStyles } from "./SummaryTab.style";
import SummaryCard from "../shared/SummaryCard";
import UnifiedTable from "../shared/UnifiedTable";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const CHART_COLORS = [
  "#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#99f6e4", "#ccfbf1",
  "#f59e0b", "#fbbf24", "#fcd34d", "#fde68a",
];

function SummaryTabView() {
  const classes = useStyles();
  const expensesByCategory = useSelector((state) => state.budgetSlice.expensesByCategory);
  const expenses = useSelector((state) => state.budgetSlice.expenses);
  const income = useSelector((state) => state.budgetSlice.income);
  const expensesTotalPaid = useSelector((state) => state.budgetSlice.expensesTotalPaid);
  const expensesTotalPlanned = useSelector((state) => state.budgetSlice.expensesTotalPlanned);
  const incomeTotalReceived = useSelector((state) => state.budgetSlice.incomeTotalReceived);
  const incomeTotalPlanned = useSelector((state) => state.budgetSlice.incomeTotalPlanned);

  const balance = incomeTotalPlanned - expensesTotalPlanned;

  const paidPercent = expensesTotalPlanned > 0
    ? Math.round((expensesTotalPaid / expensesTotalPlanned) * 100)
    : 0;

  const pieData = useMemo(() => ({
    labels: (expensesByCategory || []).map((c) => c.categoryName),
    datasets: [
      {
        data: (expensesByCategory || []).map((c) => parseFloat(c.total) || 0),
        backgroundColor: CHART_COLORS.slice(0, (expensesByCategory || []).length),
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  }), [expensesByCategory]);

  const barData = useMemo(() => ({
    labels: ["התקבל", "שולם"],
    datasets: [
      {
        label: "הכנסות",
        data: [incomeTotalReceived, 0],
        backgroundColor: "#0d9488",
        borderRadius: 6,
      },
      {
        label: "הוצאות",
        data: [0, expensesTotalPaid],
        backgroundColor: "#ef4444",
        borderRadius: 6,
      },
    ],
  }), [incomeTotalReceived, expensesTotalPaid]);

  const combinedData = useMemo(() => {
    const expensesWithType = (expenses || []).map((e) => ({ ...e, recordType: "expense" }));
    const incomeWithType = (income || []).map((i) => ({ ...i, recordType: "income" }));
    return [...expensesWithType, ...incomeWithType].sort(
      (a, b) => new Date(b.paymentDate0 || 0) - new Date(a.paymentDate0 || 0)
    );
  }, [expenses, income]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        rtl: true,
        labels: {
          font: { size: 12 },
          padding: 12,
          usePointStyle: true,
        },
      },
      tooltip: { rtl: true },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        rtl: true,
        labels: {
          font: { size: 12 },
          padding: 12,
          usePointStyle: true,
        },
      },
      tooltip: { rtl: true },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { font: { size: 11 } },
        grid: { color: "#f1f5f9" },
      },
      x: {
        ticks: { font: { size: 12 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className={classes.root}>
      {/* Summary Cards */}
      <div className={classes.cardsRow}>
        <SummaryCard title="סה״כ הכנסות" value={incomeTotalPlanned} color="#0d9488" />
        <SummaryCard title="סה״כ הוצאות" value={expensesTotalPlanned} color="#ef4444" />
        <SummaryCard
          title="יתרה"
          value={balance}
          color={balance >= 0 ? "#0d9488" : "#ef4444"}
        />
        <SummaryCard title="אחוז תשלום" value={`${paidPercent}%`} color="#64748b" suffix="" />
      </div>

      {/* Charts */}
      <div className={classes.chartsRow}>
        <div className={classes.chartCard}>
          <Typography className={classes.chartTitle}>התפלגות הוצאות לפי קטגוריה</Typography>
          <div style={{ maxWidth: "300px", margin: "0 auto" }}>
            {(expensesByCategory || []).length > 0 ? (
              <Pie data={pieData} options={pieOptions} />
            ) : (
              <Typography sx={{ textAlign: "center", color: "#94a3b8", padding: "40px 0" }}>
                אין נתונים
              </Typography>
            )}
          </div>
        </div>
        <div className={classes.chartCard}>
          <Typography className={classes.chartTitle}>הכנסות מול הוצאות</Typography>
          <div style={{ maxWidth: "400px", margin: "0 auto" }}>
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>

      {/* Combined Table */}
      <div>
        <Typography sx={{ color: "#1e293b", fontWeight: 600, fontSize: "15px", marginBottom: "12px" }}>
          כל התנועות
        </Typography>
        <UnifiedTable data={combinedData} type="combined" />
      </div>
    </div>
  );
}

export default SummaryTabView;
