import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import roomsSlice from "./slices/roomsSlice";
import snackBarSlice from "./slices/snackbarSlice";
import paymentsSlice from "./slices/paymentsSlice";
import notesSlice from "./slices/notesSlice";
import flightsSlice from "./slices/flightsSlice";
import dialogSlice from "./slices/dialogSlice"
import authSlice from "./slices/authSlice"
import staticSlice from "./slices/staticSlice"
import vacationSlice from "./slices/vacationSlice"
import budgetSlice from "./slices/budgetSlice"
import leadsSlice from "./slices/leadsSlice"
import notificationsSlice from "./slices/notificationsSlice"
import documentsSlice from "./slices/documentsSlice"
import signaturesSlice from "./slices/signaturesSlice"
import bookingsSlice from "./slices/bookingsSlice"
import dashboardSlice from "./slices/dashboardSlice"

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
