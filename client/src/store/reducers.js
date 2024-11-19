import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import authSlice from "./slice/authSlice";
import snackBarSlice from "./slice/snackbarSlice";
import paymentsSlice from "./slice/paymentsSlice";
import auctionSlice from "./slice/auctionSlice";
import flightsSlice from "./slice/flightsSlice";
import impersonationSlice from "./slice/impersonationSlice"

const createRootReducer = () =>
  combineReducers({
    authSlice: authSlice,
    userSlice: userSlice,
    snackBarSlice: snackBarSlice,
    paymentsSlice: paymentsSlice,
    auctionSlice: auctionSlice,
    impersonationSlice : impersonationSlice,
    flightsSlice:flightsSlice
  });

export default createRootReducer;
