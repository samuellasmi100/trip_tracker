import React, { useEffect, useState } from "react";
import ChildDetailsView from "./ChildDetails.view";
import { useDispatch, useSelector } from "react-redux";
import * as flightsSlice from "../../../store/slice/flightsSlice"
import * as dialogSlice from "../../../store/slice/dialogSlice"
import * as snackBarSlice from "../../../store/slice/snackbarSlice"
import * as userSlice from "../../../store/slice/userSlice"
import axios from "axios";

const ChildDetails = () => {

const dispatch = useDispatch()
  const userType = useSelector((state) => state.userSlice.userType)
  const form = useSelector((state) => state.userSlice.form)
  const [userData, setUserData] = useState({})
  const [response, setResponse] = useState(false)

  const getGuestData = async () => {
    try {
        let response 
        if(form.child_id === null){
           response = await axios.get(`http://localhost:5000/user/parent_details/${form.parent_id}/${form.family_id}`)
         }else {
         response = await axios.get(`http://localhost:5000/user/child_details/${form.child_id}`)
        }

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
