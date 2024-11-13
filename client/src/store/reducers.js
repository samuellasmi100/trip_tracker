import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import authSlice from "./slice/authSlice";
import snackBarSlice from "./slice/snackbarSlice";
import regionSlice from "./slice/regionSlice";
import auctionSlice from "./slice/auctionSlice";
import impersonationSlice from "./slice/impersonationSlice"

const createRootReducer = () =>
  combineReducers({
    authSlice: authSlice,
    userSlice: userSlice,
    snackBarSlice: snackBarSlice,
    regionSlice: regionSlice,
    auctionSlice: auctionSlice,
    impersonationSlice : impersonationSlice
  });

export default createRootReducer;
