import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import roomsSlice from "./slice/roomsSlice";
import snackBarSlice from "./slice/snackbarSlice";
import paymentsSlice from "./slice/paymentsSlice";
import auctionSlice from "./slice/auctionSlice";
import flightsSlice from "./slice/flightsSlice";
import dialogSlice from "./slice/dialogSlice"

const createRootReducer = () =>
  combineReducers({
    roomsSlice: roomsSlice,
    userSlice: userSlice,
    snackBarSlice: snackBarSlice,
    paymentsSlice: paymentsSlice,
    auctionSlice: auctionSlice,
    dialogSlice : dialogSlice,
    flightsSlice:flightsSlice
  });

export default createRootReducer;
