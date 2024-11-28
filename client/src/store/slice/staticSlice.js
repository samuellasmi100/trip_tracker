import { createSlice } from "@reduxjs/toolkit";


export const staticSlice = createSlice({
  name: "staticSlice",
  initialState: {
    activeButton:"חדרים",
  },
  reducers: {
    updateActiveButton: (state, action) => {
     state.activeButton = action.payload;
    },
    initialActiveButton: (state, action) => {
     state.activeButton = "פרטים אישיים";
    },
  },
});

export const {updateActiveButton,initialActiveButton } = staticSlice.actions;

export default staticSlice.reducer;
