import { createSlice } from "@reduxjs/toolkit";

export const impersonationSlice = createSlice({
  name: "impersonationSlice",
  initialState: {
    viewAsClientUser: null,
    impersonationOn: null,
    impersonationCreated : false
  },
  reducers: {
    setImpersonation: (state, action) => {
      state.viewAsClientUser = action.payload;
      state.impersonationOn = true;
    },
    clearImpersonation: (state, action) => {
      state.viewAsClientUser = null; 
      state.impersonationOn = false;
      state.impersonationCreated = false
    },
    setImpersonationCreated: (state, action) => {
      state.impersonationCreated = action.payload
    }
  },
});

export const { setImpersonation, clearImpersonation,setImpersonationCreated } =
  impersonationSlice.actions;

export default impersonationSlice.reducer;
