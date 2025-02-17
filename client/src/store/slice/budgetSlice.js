import { CloudDone } from "@material-ui/icons";
import { createSlice } from "@reduxjs/toolkit";
const storageToken = sessionStorage.getItem("token")

export const budgetSlice = createSlice({
  name: "budgetSlice",
  initialState: {
    form: {
      numberOfPayments: 0,
      payments: []
    },
    isExpense:true,
    open: false,
    type: "",
    activeButton: "הוסף הוצאה עתידית",
    categories: [],
    subCategories: [],
    expensesAndIncome:[],
    expectedExpensesAndIncome:[],
    sumExpensesAndIncome:"",
    sumExpectedExpensesAndIncome:"",
    status:"צפי הוצאות"
  },
  reducers: {
    updateFormField: (state, action) => {
      const { index, field, value } = action.payload;
      if (index !== undefined && state.form.payments && state.form.payments[index]) {
        state.form.payments[index][field] = value;
      } else {
        state.form[field] = value;
      }
    },
    updateForm: (state, action) => {
      let data = {...action.payload};
      let createSubCategoryForUpdate = [{
        expenses_category_id:data.subCategories,
        id:data.subCategories,
        name:data.subCategoryName,
      }]
      state.form = data
      state.form.numberOfPayments = 1;
      state.subCategories = createSubCategoryForUpdate
    },
    updateExpensesAndIncome: (state, action) => {
      state.expensesAndIncome = action.payload;
      const totalExpense = action.payload
    .filter(item => item.is_paid !== 0) 
    .reduce((sum, item) => sum + parseFloat(item.expenditure_ils), 0);
    state.sumExpensesAndIncome = totalExpense
    },
    updateExpectedExpensesAndIncome: (state, action) => {
      const totalExpenditureILS = action.payload.reduce((sum, item) => sum + parseFloat(item.expenditure_ils), 0);
      state.expectedExpensesAndIncome = action.payload;
      state.sumExpectedExpensesAndIncome = totalExpenditureILS
    },
    resetForm: (state, action) => {
      state.form = {};
      state.open = false
    },
    updateCategories: (state, action) => {
      state.categories = action.payload;
    },
    updateStatus: (state, action) => {
      state.status = action.payload;
    },
    updateSubCategories: (state, action) => {
      state.subCategories = action.payload;
    },
    updateIncomeOrExpense: (state, action) => {
      state.isExpense = action.payload;
    },
    openModal: (state, action) => {
      state.open = true;
    },
    closeModal: (state, action) => {
      state.open = false;
    },
    updateDialogType: (state, action) => {
      state.type = action.payload;
    },
    initialDialogType: (state, action) => {
      state.type = "";
    },
    updateActiveButton: (state, action) => {
      state.activeButton = action.payload;
    },
  },
});

export const { 
  updateIncomeOrExpense, openModal,
  closeModal,
  updateDialogType,
  initialDialogType,
  updateActiveButton,
  updateFormField,
  updateForm,
  resetForm,
  updateCategories,
  updateSubCategories,
  updateExpensesAndIncome,
  updateStatus,
  updateExpectedExpensesAndIncome
} = budgetSlice.actions;

export default budgetSlice.reducer;
