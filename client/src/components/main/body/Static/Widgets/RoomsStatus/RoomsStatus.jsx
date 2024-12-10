import React, { useEffect,useState } from "react";
import RoomStatusView from "./RoomsStatus.view";
import ApiRooms from "../../../../../../apis/roomsRequest";
import { useDispatch, useSelector } from "react-redux";
import { TrendingUp } from "@mui/icons-material";
import * as roomsSlice from "../../../../../../store/slice/roomsSlice"


const RoomsStatus = () => {
  const dispatch = useDispatch()
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const form = useSelector((state) => state.staticSlice.form);
  const [gaps, setGaps] = useState([])
  const [loading, setloading] = useState(false)
  const token = sessionStorage.getItem("token");
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const vacationsDates = useSelector(
    (state) => state.vacationSlice.vacationsDates
  );

  const getUnAndAvailableDates = async () => {
    try {
      let startDate = vacationsDates[0].start_date;
      let endDate = vacationsDates[vacationsDates.length - 1].end_date;
      if (endDate === "") {
        endDate = vacationsDates[vacationsDates.length - 2].end_date; 
      }
      setStartDate(startDate)
      setEndDate(endDate)
      const response = await ApiRooms.getUnAndAvailableDates(
        token,
        vacationId,
        startDate,
        endDate
      );
      if(response.data.length > 0){
        setloading(TrendingUp)
      }
      setGaps(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  const getAllRooms = async () => {
    try {
      let response = await ApiRooms.getAll(token, vacationId);
      dispatch(roomsSlice.updateRoomsList(response.data));
    } catch (error) {
      console.log(error);
    }
  };

  const generateDateRange = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = []; 
    const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
    while (start <= end) {
      const day = String(start.getDate()).padStart(2, '0'); // Two-digit day
      const month = String(start.getMonth() + 1).padStart(2, '0'); // Two-digit month
      const hebrewDay = hebrewDays[start.getDay()]; // Get the Hebrew day name
      dateRange.push(`${hebrewDay} ${day}-${month}`); // Format: יום DD-MM
      start.setDate(start.getDate() + 1);
    }
    return dateRange;
  };

  const dateRange = generateDateRange(startDate, endDate);
  useEffect(() => {
    getAllRooms()
   getUnAndAvailableDates();
  }, []);

  return <RoomStatusView gaps={gaps} dateRange={dateRange}
  /> 
};

export default RoomsStatus;
