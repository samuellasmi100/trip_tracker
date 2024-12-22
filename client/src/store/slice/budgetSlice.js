import { createSlice } from "@reduxjs/toolkit";
const storageToken = sessionStorage.getItem("token")

export const budgetSlice = createSlice({
  name: "budgetSlice",
  initialState: {
    isExpense:true
  },
  reducers: {
    upadteIncomeOrExpense: (state, action) => {
        state.incomeOrExpense = action.payload;
      },

  },
});

export const { upadteIncomeOrExpense } = budgetSlice.actions;

export default budgetSlice.reducer;
