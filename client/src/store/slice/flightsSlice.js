import { createSlice } from "@reduxjs/toolkit";

export const flightsSlice = createSlice({
  name: "flightsSlice",
  initialState: {
    form: {
      // passportNumber:"0"
    },
  },
  reducers: {
    updateFormField: (state, action) => {
      const { field, value } = action.payload;
      state.form[field] = value;
    },
    updateForm: (state, action) => {
      state.form = action.payload;
    },
  },
});

export const { updateFormField,updateForm } = flightsSlice.actions;




export default flightsSlice.reducer;
