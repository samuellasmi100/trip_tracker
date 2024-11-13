import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    auth: "",
    permission: 2,
    privileges: [],
    clients: [],
    traders: [],
    clientUsers: [],
    clientUserId: "",
    name: "",
    clientName: "",
    entrance: null,
  },
  reducers: {
    updateClients: (state, action) => {
      state.clients = action.payload;
    },
    updateTraders: (state, action) => {
      state.traders = action.payload;
    },
    updateUserDetails: (state, action) => {
      state.permission = action.payload.permission;
    },
    updateUserPrivileges: (state, action) => {
      state.privileges = action.payload;
    },
    saveLoginDetails: (state, action) => {
      state.auth = action.payload.token;
    },
    clearLoginState: (state, action) => {
      state.auth = "";
      state.permission = 2;
      state.clientUserId = "";
    },
    setClientUsers: (state, action) => {
      state.clientUsers = action.payload;
    },
    setClientUsers: (state, action) => {
      state.clientUsers = action.payload;
    },
    setNameClientName: (state, action) => {
      state.name = action.payload.name;
      state.clientName = action.payload.clientName;
    },
    clearNameAndClientName: (state, action) => {
      state.name = "";
      state.clientName = "";
    },
    setClientUserId: (state, action) => {
      state.clientUserId = action.payload;
    },
    updateEntrance: (state, action) => {
      state.entrance = action.payload;
    },
  },
});

export const getUserId = () => async (dispatch, getState) => {
  const id = getState().userSlice.id;
  return id;
};

export const {
  saveLoginDetails,
  updateEntrance,
  clearLoginState,
  updateUserDetails,
  updateClients,
  updateTraders,
  updateUserPrivileges,
  setClientUsers,
  setNameClientName,
  clearNameAndClientName,
  setClientUserId,
} = userSlice.actions;

export default userSlice.reducer;
