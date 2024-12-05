import { createSlice } from "@reduxjs/toolkit";

export const staticSlice = createSlice({
  name: "staticSlice",
  initialState: {
    activeButton: "חדרים",
    open: false,
    type: "",
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
    updateActiveButton: (state, action) => {
      state.activeButton = action.payload;
    },
    initialActiveButton: (state, action) => {
      state.activeButton = "פרטים אישיים";
    },
    openModal: (state, action) => {
      state.open = true;
    },
    closeModal: (state, action) => {
      console.log("ffffffffffff")
      state.open = false;
    },
    updateDialogType: (state, action) => {
      state.type = action.payload;
    },
    initialDialogType: (state, action) => {
      state.type = "";
    },
    resetState: (state, action) => {
      state.type = "";
      state.form = {};
      state.open = false;
    },
    
  },
});

export const {
  updateActiveButton,
  initialActiveButton,
  openModal,
  closeModal,
  updateDialogType,
  initialDialogType,
  updateFormField,
  updateForm,
  resetState
} = staticSlice.actions;

export default staticSlice.reducer;
