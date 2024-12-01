import { createSlice } from "@reduxjs/toolkit";


export const staticSlice = createSlice({
  name: "staticSlice",
  initialState: {
    activeButton:"חדרים",
    open:false,
    type:"",
    roomDetails:{}
  },
  reducers: {
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
      state.open = false;
    },
    updateDialogType: (state, action) => {
      state.type = action.payload;
    },
    initialDialogType: (state, action) => {
      state.type = "";
    },
    updateRoomDetails: (state, action) => {
      console.log(action.payload)
      state.roomDetails = action.payload;
    },
  },
});

export const {updateActiveButton,initialActiveButton,openModal,updateRoomDetails,
  closeModal,
  updateDialogType,
  initialDialogType, } = staticSlice.actions;

export default staticSlice.reducer;
