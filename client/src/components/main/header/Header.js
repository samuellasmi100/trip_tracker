import React, { useEffect } from "react";
import HeaderView from "./Header.view";
import ApiVacations from "../../../apis/vacationRequest"
import * as vacationSlice from "../../../store/slice/vacationSlice"
import { useDispatch, useSelector } from "react-redux";


const Header = () => {
const vacationList = useSelector((state) => state.vacationSlice.vacations)
  const token = sessionStorage.getItem("token")
 const dispatch = useDispatch()
 
 const handleInputChange =  async (e) => {
  const getVactionId = vacationList?.find((key) => {
    return key.name === e.target.value
  }) 
  dispatch(vacationSlice.updateChossenVacation(getVactionId.vacation_id))
  sessionStorage.setItem("vacId",getVactionId.vacation_id)
   try {
   } catch (error) {
    console.log(error)
   }
 }
  const getVacations = async () => {
    try {
      const response = await ApiVacations.getVacations(token)
      if(response?.data?.length > 0){
        dispatch(vacationSlice.updateVacationList(response?.data))
      }
    } catch (error) {
      console.log(error)
    }
  }

 useEffect(() => {
  getVacations()
 }, [])


  return <HeaderView handleInputChange={handleInputChange} />;
};

export default Header;
