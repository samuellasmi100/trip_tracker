import "./App.css";
import { useEffect, useState } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
// import SnackBar from "./components/Snackbar";
// import Login from "./components/main/Login/Login/Login";


import { Navigate, Route, Routes, useNavigate } from "react-router-dom";


import { useDispatch, useSelector } from "react-redux";
// import * as actionSnackBar from "./store/slice/snackbarSlice";
// import ApiLogs from "./apis/logRequest";
import "moment/locale/en-gb";
import UserLogs from "./components/Users/UserLogs";

function App() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [isChrome, setIsChrome] = useState(false);
  const dispatch = useDispatch();
  const token = sessionStorage.getItem("token");
  const { tokenType } = useSelector((state) => state.authSlice);
  const { viewAsClientUser, impersonationOn } = useSelector(
    (state) => state.impersonationSlice
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const permission = useSelector((state) => +state.userSlice.permission);
  const widthDown900 = useMediaQuery(theme.breakpoints.down("md"));
  let userInfo = JSON.parse(sessionStorage.getItem("userData"));
  const authToken = useSelector((state) => state.authSlice.token);


  const isAuthenticated = token !== null && token !== undefined && token !== "";
  const isAuthUser =
    authToken !== null && authToken !== undefined && authToken !== "";
  return (
    <Grid container className="App" style={{
      height:"100&",
      width:"100%",
      display:"flex",
      flexDirection:"column"
    }}>
         <Grid item sx={12} >
          </Grid>
         <Grid item sx={10} style={{padding:"12px"}}>
          <UserLogs />
          </Grid>
      
    </Grid>
  );
}

export default App;
// {!isChrome ? (
//   <Grid container style={{ height: "100vh", width: "100vw" }}>
//     <ChangeBrowser />
//   </Grid>
// ) : (
//   <Grid
//     container
//     style={{
//       height: "100vh",
//       position: widthDown900 ? "none" : "relative",
//       left:
//         token === "" || token === null
//           ? "0"
//           : widthDown900
//           ? "0px"
//           : "72px",
//       width:
//         token === "" || token === null
//           ? "100vw"
//           : widthDown900
//           ? "100vw"
//           : "calc(100vw - 72px)",
//     }}
//   >
//     <SnackBar />
//     {token === null ||
//     token === undefined ? null : widthDown900 ? null : (
//       <Sidebar />
//     )}
//     {permission === 1 ? <AdminsViewAsSelector /> : null}
//     {permission !== 1 && token !== null ? <ClientUserGreet /> : null}
//     <Routes>
//       {isAuthenticated ? (
//         <Route path="workspace" element={<Workspace />} />
//       ) : (
//         <>
//           <Route path="*" element={<Login />} />
//           <Route path="/" element={<Login />} />
//         </>
//       )}
//       {isAuthUser && (
//         <>
//           <Route path="/verify" element={<AuthSelector />} />
//           <Route path="/forgot_password" element={<ForgotPassword />} />
//         </>
//       )}

//       {isAuthenticated && (
//         <>
//           <Route path="client_info" element={<StaticTabs />} />
//           <Route path="reports" element={<Reports />} />
//           <Route path="workspace" element={<Workspace />} />
//         </>
//       )}
//     </Routes>
 
//   </Grid>
// )}