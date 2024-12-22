import "./App.css";
import { Grid} from "@mui/material";
import SnackBar from "./components/Snackbar";
import Budgets from "./components/main/body/Budgets/Budgets";
import {  Route, Routes, useNavigate } from "react-router-dom";
import {useSelector } from "react-redux";
import "moment/locale/en-gb";
import FamilyList from "./components/main/body/WorkSpace/Families/FamilyList/FamilyList"
import Header from "./components/main/header/Header";
import Sidebar from "./components/main/aside/Sidebar";
import Login from "./components/main/body/Login/Login";
import Static from "./components/main/body/Static/Static";


function App() {
  const token = useSelector((state) => state.authSlice.token);
  const isAuthenticated = token !== null && token !== undefined && token !== "";



  return (
    <Grid className="App" style={{ height: "100vh", width: "100vw" }}>
      <SnackBar />
     {isAuthenticated ? <Sidebar /> : <></>}
      <Grid>
        <Grid item xs={10} style={{ padding: "12px" }}>
          {/* <Header /> */}
        </Grid>

        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/workspace" element={<FamilyList />} />
              <Route path="/static" element={<Static />} />
              <Route path="/budgets" element={<Budgets />} />
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
