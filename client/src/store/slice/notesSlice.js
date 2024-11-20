import { createSlice } from "@reduxjs/toolkit";

export const notesSlice = createSlice({
  name: "notesSlice",
  initialState: {
    form: {}
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

export const { updateFormField,updateForm,resetForm } = notesSlice.actions;




export default notesSlice.reducer;
