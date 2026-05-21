import { createSlice } from "@reduxjs/toolkit";
const storageToken = sessionStorage.getItem("token")

export const authSlice = createSlice({
  name: "authSlice",
  initialState: {
    token: storageToken !== null && storageToken !== undefined && storageToken !== "" ? storageToken : "",
  },
  reducers: {
    setUserData: (state, action) => {
      state.token = action.payload;
    },
    clearUserData: (state, action) => {
      state.token = "";
    },
    setChosenWay: (state, action) => {
      state.chosenWay = action.payload;
    },
  },
});

export const { setUserData, setChosenWay, clearUserData } = authSlice.actions;

export default authSlice.reducer;
