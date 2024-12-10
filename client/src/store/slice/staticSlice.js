import { createSlice } from "@reduxjs/toolkit";

export const staticSlice = createSlice({
  name: "staticSlice",
  initialState: {
    activeButton: "חדרים",
    mainModalOpen: false,
    detailsModalOpen: false,
    type: "",
    detailsModalType:"",
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
    openMainModal: (state, action) => {
      console.log("first")
      state.mainModalOpen = true;
    },
    closeMainModal: (state, action) => {
      state.mainModalOpen = false;
    },
    openDetailsModal: (state, action) => {
      state.detailsModalOpen = true;
    },
    closeDetailsModal: (state, action) => {
      state.detailsModalOpen = false;
    },
    updateDialogType: (state, action) => {
      state.type = action.payload;
    },
    updateDetailsModalType: (state, action) => {
      state.detailsModalType = action.payload;
    },
    initialDialogType: (state, action) => {
      state.type = "";
    },
    resetState: (state, action) => {
      state.type = "";
      state.form = {};
    },
    
  },
});

export const {
  updateActiveButton,
  initialActiveButton,
  openMainModal,
  closeMainModal,
  openDetailsModal,
  closeDetailsModal,
  updateDialogType,
  initialDialogType,
  updateFormField,
  updateForm,
  resetState,
  updateDetailsModalType
} = staticSlice.actions;

export default staticSlice.reducer;
