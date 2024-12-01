import React, { useEffect, useState } from "react";
import ChildDetailsView from "./ChildDetails.view";
import { useDispatch, useSelector } from "react-redux";
import ApiUser from "../../../apis/userRequest"
import axios from "axios";
import jsPDF from "jspdf";

const ChildDetails = () => {

  const dispatch = useDispatch()
  const userType = useSelector((state) => state.userSlice.userType)
  const form = useSelector((state) => state.userSlice.form)
  const [userData, setUserData] = useState({})
  const [response, setResponse] = useState(false)
  const token = sessionStorage.getItem("token")
  
  const getGuestData = async () => {

    try {
      let response = await ApiUser.getUserDetails(token,form.user_id,form.family_id,form.is_in_group)
      //   let response = await axios.get(`${process.env.REACT_APP_SERVER_BASE_URL}/user/details/${form.user_id}/${form.family_id}`)
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
