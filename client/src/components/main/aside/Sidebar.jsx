import React from "react";
import {useState } from "react";
import SidebarView from "./Sidebar.view";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import * as authSlice from "../../../store/slice/authSlice"

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); 

  const handleLogOut = () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userData");
      delete axios.defaults.headers.common["Authorization"];
      dispatch(authSlice.clearUserData());
  };

  const logoutButtonFunction = async () => {
    try {  
        handleLogOut();
        navigate("/");
    } catch (error) {
      console.log(error)
    }
  };

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };


  
  return (
    <SidebarView
      logoutButtonFunction={logoutButtonFunction}
      handleMenuOpen={handleMenuOpen}
      handleMenuClose={handleMenuClose}
      menuOpen={menuOpen}
    />
  );
}

export default Sidebar;