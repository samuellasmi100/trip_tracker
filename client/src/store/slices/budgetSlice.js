import { createSlice } from "@reduxjs/toolkit";

export const budgetSlice = createSlice({
  name: "budgetSlice",
  initialState: {
    // Tab navigation
    activeTab: 0, // 0=הוצאות, 1=הכנסות, 2=סיכום

    // Dialog state
    dialogOpen: false,
    dialogType: "",
    // Types: "addExpense", "editExpense", "addIncome", "editIncome", "manageCategories"

    // Form (shared for add/edit dialogs)
    form: {
      numberOfPayments: 1,
    },

    // Expense categories & subcategories
    categories: [],
    subCategories: [],

    // Income categories & subcategories
    incomeCategories: [],
    incomeSubCategories: [],

    // Unified expenses list
    expenses: [],
    expensesTotalPaid: 0,
    expensesTotalPlanned: 0,

    // Unified income list
    income: [],
    incomeTotalReceived: 0,
    incomeTotalPlanned: 0,

    // Summary data
    summary: null,
    expensesByCategory: [],
    incomeByCategory: [],

    // Exchange rates
    exchangeRates: [],

    // Search/filter
    searchTerm: "",
    statusFilter: "all", // "all", "paid", "planned", "overdue"
  },
  reducers: {
    // Tab
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    // Dialog
    openDialog: (state, action) => {
      state.dialogOpen = true;
      state.dialogType = action.payload;
    },
    closeDialog: (state) => {
      state.dialogOpen = false;
      state.dialogType = "";
    },

    // Form
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    setForm: (state, action) => {
      state.form = action.payload;
    },
    resetForm: (state) => {
      state.form = { numberOfPayments: 1 };
      state.subCategories = [];
      state.incomeSubCategories = [];
    },

    // Categories
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSubCategories: (state, action) => {
      state.subCategories = action.payload;
    },
    setIncomeCategories: (state, action) => {
      state.incomeCategories = action.payload;
    },
    setIncomeSubCategories: (state, action) => {
      state.incomeSubCategories = action.payload;
    },

    // Expenses list
    setExpenses: (state, action) => {
      const data = action.payload || [];
      state.expenses = data;
      state.expensesTotalPaid = data
        .filter(item => item.is_paid === 1)
        .reduce((sum, item) => sum + parseFloat(item.expenditure_ils || 0), 0);
      state.expensesTotalPlanned = data
        .reduce((sum, item) => sum + parseFloat(item.expenditure_ils || 0), 0);
    },

    // Income list
    setIncome: (state, action) => {
      const data = action.payload || [];
      state.income = data;
      state.incomeTotalReceived = data
        .filter(item => item.is_paid === 1)
        .reduce((sum, item) => sum + parseFloat(item.expenditure_ils || 0), 0);
      state.incomeTotalPlanned = data
        .reduce((sum, item) => sum + parseFloat(item.expenditure_ils || 0), 0);
    },

    // Summary
    setSummary: (state, action) => {
      state.summary = action.payload.summary;
      state.expensesByCategory = action.payload.expensesByCategory;
      state.incomeByCategory = action.payload.incomeByCategory;
    },

    // Exchange rates
    setExchangeRates: (state, action) => {
      state.exchangeRates = action.payload || [];
    },

    // Search/Filter
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
  },
});

export const {
  setActiveTab,
  openDialog,
  closeDialog,
  updateFormField,
  setForm,
  resetForm,
  setCategories,
  setSubCategories,
  setIncomeCategories,
  setIncomeSubCategories,
  setExpenses,
  setIncome,
  setSummary,
  setExchangeRates,
  setSearchTerm,
  setStatusFilter,
} = budgetSlice.actions;

export default budgetSlice.reducer;
