import { createSlice } from "@reduxjs/toolkit";

export const dialogSlice = createSlice({
  name: "dialogSlice",
  initialState: {
    open:false,
    type:"",
    activeButton:"פרטים אישיים",
   
  },
  reducers: {
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
    initialActiveButton: (state, action) => {
      state.activeButton = "פרטים אישיים";
    },
    
  },
});

export const { openModal, closeModal,updateDialogType,initialDialogType, updateActiveButton,initialActiveButton} =
dialogSlice.actions;

export default dialogSlice.reducer;
