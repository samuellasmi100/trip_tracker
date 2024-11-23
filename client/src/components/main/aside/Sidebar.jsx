import React from "react";
import { useEffect, useState } from "react";
import SidebarView from "./Sidebar.view";
import axios from "axios";
import { useDispatch } from "react-redux";
// import * as userSlice from "../../../store/slice/userSlice";
// import * as authSlice from "../../../store/slice/authSlice";
import Api from "../../../apis/userRequest";
import { useNavigate } from "react-router-dom";
import ApiClient from "../../../apis/clientRequest";
import ApiUser from "../../../apis/userRequest";
import ApiAuction from "../../../apis/auctionRequest";

import ApiRegion from "../../../apis/regionRequest";
import ApiLogs from "../../../apis/logRequest";
// import * as regionSlice from "../../../store/slice/regionSlice";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let token = sessionStorage.getItem("token");
  let userInfo = JSON.parse(sessionStorage.getItem("userData"));
  const [menuOpen, setMenuOpen] = useState(false); // State for menu visibility

  const handleLogOut = () => {
    //   closeWS()
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userData");
      delete axios.defaults.headers.common["Authorization"];
    //   dispatch(userSlice.clearLoginState());
    //   dispatch(userSlice.clearNameAndClientName());
    //   dispatch(authSlice.clearUserData());
      
  
  };

  const getClientUserRegions = async () => {
    try {
      const clientUserRegions = await ApiRegion.getClientUserRegions(token);      if (clientUserRegions.data) {
        let regionSorted = clientUserRegions.data?.sort((a, b) => a.region_name.localeCompare(b.region_name))
        // dispatch(regionSlice.updateRegionsList(regionSorted));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const apiPreRequestPermission = async () => {
    try {
      const result = await Api.pathAuthRequest(token);
    //   dispatch(userSlice.updateUserDetails(result.data));
      if(result.data.clientUserId){
        // dispatch(userSlice.setClientUserId(result.data.clientUserId))
      }
      if(result.data.name){
        // dispatch(userSlice.setNameClientName(result.data))
      }
      let privilegesArray = result.data.privileges.replace(/^,/, "").split(",");
    //   dispatch(userSlice.updateUserPrivileges(privilegesArray));
      if (result.data.permission === "1" || result.data.permission === 1) {
        try {
          const result = await ApiClient.getAllClientsUsers(token);
 
          if (result.data.length > 0) {
            result.data.sort((a, b) => {
              if (a.fullName.toLowerCase() < b.fullName.toLowerCase()) {
                  return -1;
              }
              if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) {
                  return 1;
              }
              return 0;
          });
            // dispatch(userSlice.setClientUsers(result.data));
          }
        } catch (error) {
          console.log(error);
        }
      }
      if (result.data.permission === "2") {
        getClientUserRegions();
      }
    } catch (error) {
      if (error.response.data.status === 498) {
        handleLogOut();
        // dispatch(userSlice.clearLoginState());
        navigate("/");
      }
    }
  };

  const apiGetClientUserById = async () => {
    try {
      const result = await ApiClient.getClientUserById(
        token,
        userInfo.clientUserId
      );
      if (result.data.length > 0) {
        let privilegesArray = result.data[0].privileges
          .replace(/^,/, "")
          .split(",");
        // dispatch(userSlice.updateUserPrivileges(privilegesArray));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logoutButtonFunction = async () => {
    try {
      let logDetails = {
        type:"Logged Out",
        clientUserId:userInfo.clientUserId
      }
     
      if(userInfo.type !== "trader"){
         ApiLogs.sendLog(token,logDetails) 
         ApiAuction.removeAllTransactionOfAuctionWhenUserLogOut(token,userInfo.clientUserId)
        navigate("/");
        handleLogOut();
      }else {
        handleLogOut();
        navigate("/");
      }
    
    } catch (error) {
      console.log(error)
    }
  
  // Call the logout function
  };

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    // apiPreRequestPermission();
  }, []);

  useEffect(() => {
    // apiGetClientUserById();
  }, []);

  const handleButtonClick = (e) => {
    // Your mailto handling logic here
  
    e.preventDefault()
    const emailAddress = 'support.bond-x@makorsecurities.com';
    const subject = 'Bond-X Support Query';
    const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}`;
    // window.location.href = mailtoLink;
    window.open(mailtoLink, '_blank');

  };
  
  return (
    <SidebarView
      logoutButtonFunction={logoutButtonFunction}
      handleMenuOpen={handleMenuOpen}
      handleMenuClose={handleMenuClose}
      menuOpen={menuOpen}
      handleButtonClick={handleButtonClick}
    />
  );
}

export default Sidebar;