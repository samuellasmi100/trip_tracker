import { createSlice } from "@reduxjs/toolkit";

export const paymentsSlice = createSlice({
  name: "paymentsSlice",
  initialState: {
    summary: [],   // per-family totals, used by the Payments widget
    loading: false,
  },
  reducers: {
    setSummary: (state, action) => {
      state.summary = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    // kept for backward-compat (called in FamilyList clearModalForms)
    resetForm: () => {},
  },
});

export const { setSummary, setLoading, resetForm } = paymentsSlice.actions;

export default paymentsSlice.reducer;
