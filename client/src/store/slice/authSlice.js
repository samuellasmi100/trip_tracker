import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    token: "",
    tokenType: "",
    userPhone: "",
    userEmail: "",
    chosenWay: "",
    name : "",
    clientName : ""
  },
  reducers: {
    setUserData: (state, action) => {
      state.token = action.payload.token;
      state.userPhone = action.payload.phone;
      state.userEmail = action.payload.email;
      state.tokenType = action.payload.type;
    },
    clearUserData: (state, action) => {
      state.token = "";
      state.userPhone = "";
      state.userEmail = "";
      state.tokenType = "";
      state.chosenWay = "";
    },
    setChosenWay: (state, action) => {
      state.chosenWay = action.payload;
    },
  },
});

export const { setUserData, setChosenWay, clearUserData } = authSlice.actions;

export default authSlice.reducer;
