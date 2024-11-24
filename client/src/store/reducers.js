import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import roomsSlice from "./slice/roomsSlice";
import snackBarSlice from "./slice/snackbarSlice";
import paymentsSlice from "./slice/paymentsSlice";
import notesSlice from "./slice/notesSlice";
import flightsSlice from "./slice/flightsSlice";
import dialogSlice from "./slice/dialogSlice"
import authSlice from "./slice/authSlice"

const createRootReducer = () =>
  combineReducers({
    roomsSlice: roomsSlice,
    userSlice: userSlice,
    snackBarSlice: snackBarSlice,
    paymentsSlice: paymentsSlice,
    notesSlice: notesSlice,
    dialogSlice : dialogSlice,
    flightsSlice:flightsSlice,
    authSlice:authSlice
  });

export default createRootReducer;
