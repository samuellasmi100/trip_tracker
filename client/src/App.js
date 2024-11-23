import "./App.css";
import { useEffect, useState } from "react";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import SnackBar from "./components/Snackbar";
// import Login from "./components/main/Login/Login/Login";


import { Navigate, Route, Routes, useNavigate } from "react-router-dom";


import { useDispatch, useSelector } from "react-redux";
// import * as actionSnackBar from "./store/slice/snackbarSlice";
// import ApiLogs from "./apis/logRequest";
import "moment/locale/en-gb";
import FamilyList from "./components/main/body/Families/FamilyList/FamilyList";
import Header from "./components/main/header/Header";
import Sidebar from "./components/main/aside/Sidebar";

function App() {
 

  return (
    <Grid className="App" style={{ height:"100vh",width:"100vw"}}>
        <SnackBar />
        <Sidebar /> 
       <Grid item xs={10} style={{padding:"12px"}}>
         <Header />
        </Grid>
        <Grid item xs={10} style={{padding:"12px"}}>
         <FamilyList />
         </Grid>
          {/* <Routes>
            
          </Routes> */}
          {/* </Grid> */}
         {/* <Grid item sx={12} >
          </Grid>
         <Grid item sx={10} style={{padding:"12px"}}>
          <UserLogs />
          </Grid> */}
      
    </Grid>
  );
}

export default App;
