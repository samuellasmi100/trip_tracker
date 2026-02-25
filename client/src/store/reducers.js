import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slice/userSlice";
import roomsSlice from "./slice/roomsSlice";
import snackBarSlice from "./slice/snackbarSlice";
import paymentsSlice from "./slice/paymentsSlice";
import notesSlice from "./slice/notesSlice";
import flightsSlice from "./slice/flightsSlice";
import dialogSlice from "./slice/dialogSlice"
import authSlice from "./slice/authSlice"
import staticSlice from "./slice/staticSlice"
import vacationSlice from "./slice/vacationSlice"
import budgetSlice from "./slice/budgetSlice"
import leadsSlice from "./slice/leadsSlice"
import notificationsSlice from "./slice/notificationsSlice"
import documentsSlice from "./slice/documentsSlice"
import signaturesSlice from "./slice/signaturesSlice"
import bookingsSlice from "./slice/bookingsSlice"
import dashboardSlice from "./slice/dashboardSlice"

const createRootReducer = () =>
  combineReducers({
    roomsSlice: roomsSlice,
    userSlice: userSlice,
    snackBarSlice: snackBarSlice,
    paymentsSlice: paymentsSlice,
    notesSlice: notesSlice,
    dialogSlice : dialogSlice,
    flightsSlice:flightsSlice,
    authSlice:authSlice,
    staticSlice:staticSlice,
    vacationSlice:vacationSlice,
    budgetSlice:budgetSlice,
    leadsSlice:leadsSlice,
    notificationsSlice:notificationsSlice,
    documentsSlice:documentsSlice,
    signaturesSlice:signaturesSlice,
    bookingsSlice:bookingsSlice,
    dashboardSlice:dashboardSlice,
  });

export default createRootReducer;
