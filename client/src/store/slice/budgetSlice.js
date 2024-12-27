import { createSlice } from "@reduxjs/toolkit";
const storageToken = sessionStorage.getItem("token")

export const budgetSlice = createSlice({
  name: "budgetSlice",
  initialState: {
    form:{},
    isExpense:true,
    open:false,
    type:"",
    activeButton:"צפי תקציב",
    categories:[],
    subCategories:[]
  },
  reducers: {

    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
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

export const { upadteIncomeOrExpense ,openModal,
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
