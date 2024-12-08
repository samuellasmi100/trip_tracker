import React, { useEffect,useState } from "react";
import DateAvailabilityView from "./DateAvailability.view";
import ApiRooms from "../../../../../../apis/roomsRequest";
import { useSelector } from "react-redux";
import { TrendingUp } from "@mui/icons-material";

const DateAvailability = () => {
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const form = useSelector((state) => state.staticSlice.form);
  const [gaps, setGaps] = useState([])
  const [loading, setloading] = useState(false)
  const token = sessionStorage.getItem("token");
  const vacationsDates = useSelector(
    (state) => state.vacationSlice.vacationsDates
  );

  const getUnAndAvailableDates = async () => {
    try {
      let startDate = vacationsDates[0].start_date;
      let endDate = vacationsDates[vacationsDates.length - 1].end_date;
      if (endDate === "") {
        endDate = vacationsDates[vacationsDates.length - 2].end_date; // If empty, use the previous object's end date
      }
      
      const response = await ApiRooms.getUnAndAvailableDates(
        token,
        form.rooms_id,
        vacationId,
        startDate,
        endDate
      );
      console.log(response)
      if(response.data.length > 0){
        setloading(TrendingUp)
      }
      setGaps(response.data)
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
   getUnAndAvailableDates();
  }, []);

  return loading ? <DateAvailabilityView gaps={gaps}/> :<></>;
};

export default DateAvailability;
