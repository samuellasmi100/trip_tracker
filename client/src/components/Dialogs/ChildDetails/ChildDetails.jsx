import React, { useEffect, useState } from "react";
import ChildDetailsView from "./ChildDetails.view";
import { useDispatch, useSelector } from "react-redux";
import ApiUser from "../../../apis/userRequest"
import axios from "axios";

const ChildDetails = () => {

  const form = useSelector((state) => state.userSlice.form)
  const [userData, setUserData] = useState({})
  const [response, setResponse] = useState(false)
  const token = sessionStorage.getItem("token")
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  
  const getGuestData = async () => {
    try {
      let response = await ApiUser.getUserDetails(token,form.user_id,form.family_id,form.is_in_group,vacationId)
      if(response?.data?.userDetails !== undefined){
        setResponse(true)
        setUserData(response.data)
      }     
    } catch (error) {
      console.log(error)
    }
  }

 
  useEffect(() => {
    getGuestData()
  }, [])
  
  return (
  response ? <ChildDetailsView userData={userData}/> : <></>
  );
};

export default ChildDetails;
