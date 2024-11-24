import "./App.css";
import { useEffect, useState } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import SnackBar from "./components/Snackbar";
import Analytics from "./components/main/body/Analytics/Analytics"
// import Login from "./components/main/Login/Login/Login";


import { Navigate, Route, Routes, useNavigate } from "react-router-dom";


import { useDispatch, useSelector } from "react-redux";
// import * as actionSnackBar from "./store/slice/snackbarSlice";
// import ApiLogs from "./apis/logRequest";
import "moment/locale/en-gb";
import FamilyList from "./components/main/body/Families/FamilyList/FamilyList";
import Header from "./components/main/header/Header";
import Sidebar from "./components/main/aside/Sidebar";
import Login from "./components/main/body/Login/Login";

function App() {


  return (
    <Grid className="App" style={{ height: "100vh", width: "100vw" }}>
      <SnackBar />
      <Sidebar />
  
      <Grid>
        <Grid item xs={10} style={{ padding: "12px" }}>
          <Header />
        </Grid>
     <Routes>
       {/* <Grid item xs={10} style={{ padding: "12px" }}> */}
       <Route path="/login" element={<Login />} />

        <Route path="/workspace" element={<FamilyList />} />
        <Route path="/analytics" element={<Analytics />} />
        {/* </Grid> */}
    </Routes>

      </Grid>
     
    </Grid>
  );
}

export default App;
