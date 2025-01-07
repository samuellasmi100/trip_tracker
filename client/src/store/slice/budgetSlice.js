import { createSlice } from "@reduxjs/toolkit";
const storageToken = sessionStorage.getItem("token")

export const budgetSlice = createSlice({
  name: "budgetSlice",
  initialState: {
    form: {
      numberOfPayments: 0,
      payments: []
    },
    isExpense: true,
    open: false,
    type: "",
    activeButton: "הוסף הוצאה עתידית",
    categories: [],
    subCategories: []
  },
  reducers: {
    updateFormField: (state, action) => {
      const { index, field, value } = action.payload;
    
      if (index !== undefined && state.form.payments && state.form.payments[index]) {
        // Update a specific field in a payment object
        state.form.payments[index][field] = value;
      } else {
        // Update top-level fields like `numberOfPayments`
        state.form[field] = value;
      }
    },
    updateForm: (state, action) => {
      state.form = action.payload;
    },
    resetForm: (state, action) => {
      state.form = {};
    },
    updateCategories: (state, action) => {
      state.categories = action.payload;
    },
    updateSubCategories: (state, action) => {
      state.subCategories = action.payload;
    },
    upadteIncomeOrExpense: (state, action) => {
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

export const { upadteIncomeOrExpense, openModal,
  closeModal,
  updateDialogType,
  initialDialogType,
  updateActiveButton,
  updateFormField,
  updateForm,
  resetForm,
  updateCategories,
  updateSubCategories
} = budgetSlice.actions;

export default budgetSlice.reducer;
