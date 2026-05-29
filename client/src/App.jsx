import "./App.css";
import { Grid } from "@mui/material";
import SnackBar from "./components/SnackBar/SnackBar";
import Budgets from "./components/pages/Budgets/Budgets";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "moment/locale/en-gb";
import FamilyList from "./components/pages/FamilyList/FamilyList";
import Header from "./components/layout/Header/Header";
import Sidebar from "./components/layout/Sidebar/Sidebar";
import Login from "./components/pages/Login/Login";
import Static from "./components/pages/Static/Static";
import Leads from "./components/pages/Leads/Leads";
import Settings from "./components/pages/Settings/Settings";
import PublicLeadForm from "./components/Public/PublicLeadForm/PublicLeadForm";
import PublicDocumentUpload from "./components/Public/PublicDocumentUpload/PublicDocumentUpload";
import PublicSignaturePage from "./components/Public/PublicSignaturePage/PublicSignaturePage";
import PublicBookingForm from "./components/Public/PublicBookingForm/PublicBookingForm";
import PublicRegistration from "./components/Public/PublicRegistration/PublicRegistration";
import Dashboard from "./components/pages/Dashboard/Dashboard";
import RequireVacation from "./components/layout/RequireVacation/RequireVacation";
import * as notificationsSlice from "./store/slices/notificationsSlice";
import * as snackBarSlice from "./store/slices/snackbarSlice";
import { connectSocket, disconnectSocket, getSocket } from "./utils/socketService";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authSlice.token);
  const isAuthenticated = token !== null && token !== undefined && token !== "";

  // Reconnect socket on page refresh (token from sessionStorage via Redux initial state).
  //
  // Handlers are captured as named consts so the cleanup can call
  // `socket.off(event, handler)` with a specific reference, instead of
  // `socket.off(event)` which removes EVERY listener for that event —
  // that's a footgun any time another component (e.g. FamilyList)
  // subscribes to the same event.
  useEffect(() => {
    if (!token) {
      disconnectSocket();
      dispatch(notificationsSlice.clearNotifications());
      return;
    }

    const socket = connectSocket(token);

    const onNewLead = (notification) => {
      dispatch(notificationsSlice.addNotification(notification));
      dispatch(snackBarSlice.setSnackBar({
        type: "info",
        message: `ליד חדש: ${notification.message || notification.title}`,
        timeout: 5000,
      }));
    };
    const onNewSignature = (notification) => {
      dispatch(notificationsSlice.addNotification(notification));
      dispatch(snackBarSlice.setSnackBar({
        type: "success",
        message: `חתימה חדשה: ${notification.message || notification.title}`,
        timeout: 5000,
      }));
    };
    const onNewBooking = (notification) => {
      dispatch(notificationsSlice.addNotification(notification));
      dispatch(snackBarSlice.setSnackBar({
        type: "info",
        message: `טופס הזמנה חדש: ${notification.message || notification.title}`,
        timeout: 5000,
      }));
    };
    const onNewRegistration = (notification) => {
      dispatch(notificationsSlice.addNotification(notification));
      dispatch(snackBarSlice.setSnackBar({
        type: "success",
        message: `טופס רישום נחתם: ${notification.message || notification.title}`,
        timeout: 5000,
      }));
    };

    socket.on("new_lead",         onNewLead);
    socket.on("new_signature",    onNewSignature);
    socket.on("new_booking",      onNewBooking);
    socket.on("new_registration", onNewRegistration);

    return () => {
      const s = getSocket();
      if (!s) return;
      s.off("new_lead",         onNewLead);
      s.off("new_signature",    onNewSignature);
      s.off("new_booking",      onNewBooking);
      s.off("new_registration", onNewRegistration);
    };
  }, [token]);

  return (
    <Grid className="App" style={{ height: "100vh", width: "100vw", backgroundColor: "#f1f5f9" }}>
      <SnackBar />
      {isAuthenticated ? <Sidebar /> : <></>}
      <Grid className={isAuthenticated ? "main-content" : ""} style={isAuthenticated ? { display: "flex", flexDirection: "column", minHeight: "100vh" } : {}}>
        {isAuthenticated ? <Header /> : null}

        <Routes>
          {/* Always-public routes — no auth required */}
          <Route path="/public/leads/:vacationId" element={<PublicLeadForm />} />
          <Route path="/public/documents/:vacationId/:docToken" element={<PublicDocumentUpload />} />
          <Route path="/public/sign/:vacationId/:docToken" element={<PublicSignaturePage />} />
          <Route path="/public/booking/:vacationId/:docToken" element={<PublicBookingForm />} />
          <Route path="/public/register/:vacationId/:token" element={<PublicRegistration />} />

          {isAuthenticated ? (
            <>
              <Route path="/workspace" element={<RequireVacation><FamilyList /></RequireVacation>} />
              <Route path="/static" element={<RequireVacation><Static /></RequireVacation>} />
              <Route path="/budgets" element={<RequireVacation><Budgets /></RequireVacation>} />
              <Route path="/leads" element={<RequireVacation><Leads /></RequireVacation>} />
              <Route path="/settings" element={<RequireVacation><Settings /></RequireVacation>} />
              <Route path="/dashboard" element={<Dashboard />} />
            </>
          ) : (
            <>
              <Route path="*" element={<Login />} />
              <Route path="/" element={<Login />} />
            </>
          )}
          <Route path="/" element={<Login />} />
        </Routes>
      </Grid>
    </Grid>
  );
}

export default App;
