import React, { useEffect } from "react";
import DateAvailabilityView from "./DateAvailability.view";
import ApiRooms from "../../../../../../apis/roomsRequest";
import { useSelector } from "react-redux";

const DateAvailability = () => {
  const vacationId = useSelector((state) => state.vacationSlice.vacationId);
  const form = useSelector((state) => state.staticSlice.form);
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
      console.log(form)
      const response = ApiRooms.getUnAndAvailableDates(
        token,
        form.rooms_id,
        vacationId,
        startDate,
        endDate
      );
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUnAndAvailableDates();
  }, []);

  return <DateAvailabilityView />;
};

export default DateAvailability;
