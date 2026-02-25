import "./App.css";
import { Grid } from "@mui/material";
import SnackBar from "./components/Snackbar";
import Budgets from "./components/main/body/Budgets/Budgets";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import "moment/locale/en-gb";
import FamilyList from "./components/main/body/WorkSpace/Families/FamilyList/FamilyList";
import Header from "./components/main/header/Header";
import Sidebar from "./components/main/aside/Sidebar";
import Login from "./components/main/body/Login/Login";
import Static from "./components/main/body/Static/Static";
import Leads from "./components/main/body/Static/Widgets/Leads/Leads";
import Settings from "./components/main/body/Settings/Settings";
import PublicLeadForm from "./components/public/PublicLeadForm/PublicLeadForm";
import PublicDocumentUpload from "./components/public/PublicDocumentUpload/PublicDocumentUpload";
import PublicSignaturePage from "./components/public/PublicSignaturePage/PublicSignaturePage";
import PublicBookingForm from "./components/public/PublicBookingForm/PublicBookingForm";
import Dashboard from "./components/main/body/Dashboard/Dashboard";
import * as notificationsSlice from "./store/slice/notificationsSlice";
import * as snackBarSlice from "./store/slice/snackbarSlice";
import { connectSocket, disconnectSocket, getSocket } from "./utils/socketService";

function App() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authSlice.token);
  const isAuthenticated = token !== null && token !== undefined && token !== "";

  // Reconnect socket on page refresh (token from sessionStorage via Redux initial state)
  useEffect(() => {
    if (token) {
      const socket = connectSocket(token);

      // Listen for real-time new_lead events from any vacation
      socket.on("new_lead", (notification) => {
        dispatch(notificationsSlice.addNotification(notification));
        dispatch(
          snackBarSlice.setSnackBar({
            type: "info",
            message: `ליד חדש: ${notification.message || notification.title}`,
            timeout: 5000,
          })
        );
      });

      // Listen for real-time new_signature events from any vacation
      socket.on("new_signature", (notification) => {
        dispatch(notificationsSlice.addNotification(notification));
        dispatch(
          snackBarSlice.setSnackBar({
            type: "success",
            message: `חתימה חדשה: ${notification.message || notification.title}`,
            timeout: 5000,
          })
        );
      });

      // Listen for real-time new_booking events from any vacation
      socket.on("new_booking", (notification) => {
        dispatch(notificationsSlice.addNotification(notification));
        dispatch(
          snackBarSlice.setSnackBar({
            type: "info",
            message: `טופס הזמנה חדש: ${notification.message || notification.title}`,
            timeout: 5000,
          })
        );
      });
    } else {
      disconnectSocket();
      dispatch(notificationsSlice.clearNotifications());
    }

    return () => {
      getSocket()?.off("new_lead");
      getSocket()?.off("new_signature");
      getSocket()?.off("new_booking");
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

          {isAuthenticated ? (
            <>
              <Route path="/workspace" element={<FamilyList />} />
              <Route path="/static" element={<Static />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/settings" element={<Settings />} />
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
