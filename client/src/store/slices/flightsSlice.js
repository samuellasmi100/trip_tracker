import { createSlice } from "@reduxjs/toolkit";

export const flightsSlice = createSlice({
  name: "flightsSlice",
  initialState: {
    form: {},
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
  },
});

export const { updateFormField,updateForm,resetForm } = flightsSlice.actions;




export default flightsSlice.reducer;
