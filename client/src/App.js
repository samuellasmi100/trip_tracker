import "./App.css";
import { useEffect, useState } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import SnackBar from "./components/Snackbar";
import Analytics from "./components/main/body/Analytics/Analytics";
import {  Route, Routes, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "moment/locale/en-gb";
import FamilyList from "./components/main/body/Families/FamilyList/FamilyList";
import Header from "./components/main/header/Header";
import Sidebar from "./components/main/aside/Sidebar";
import Login from "./components/main/body/Login/Login";

function App() {
  const token = useSelector((state) => state.authSlice.token);
  const isAuthenticated = token !== null && token !== undefined && token !== "";

  return (
    <Grid className="App" style={{ height: "100vh", width: "100vw" }}>
      <SnackBar />
     {isAuthenticated ? <Sidebar /> : <></>}
      <Grid>
        <Grid item xs={10} style={{ padding: "12px" }}>
          <Header />
        </Grid>

        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/workspace" element={<FamilyList />} />
              <Route path="/analytics" element={<Analytics />} />
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
