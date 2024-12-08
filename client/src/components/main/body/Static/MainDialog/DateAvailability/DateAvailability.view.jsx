import { Grid, Select, InputLabel, MenuItem, OutlinedInput } from "@mui/material";
import React from "react";
import { useStyles } from "./DateAvailability.style"
import { useSelector } from "react-redux";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import "./DateAvailability.css"






function DateAvailabilityView({gaps}) {
 console.log(gaps)
  const startDate = new Date('2025-08-04');
  const endDate = new Date('2025-08-24');

  // Convert gap start and end to Date objects
  const gapStartDate = new Date(gaps[0].gap_start);
  const gapEndDate = new Date(gaps[0].gap_end);

  // Check if a given date is in the free gap
  const isFreeDate = (date) => {
    return date >= gapStartDate && date <= gapEndDate;
  };

  // Generate days for the calendar in the range from startDate to endDate
  const tileClassName = ({ date, view }) => {
    if (view === 'month' && date >= startDate && date <= endDate) {
      // If the date is free, mark it green; otherwise, mark it red
      return isFreeDate(date) ? 'free-date' : 'occupied-date';
    }
    return ''; // Default return for dates outside the range
  };

  return (
    <Grid>
        <Calendar
        minDate={startDate}
        maxDate={endDate}
        tileClassName={tileClassName}
        defaultView="month"
        value={new Date('2025-08-10')} // Open the calendar on August 2025
      />
      <style jsx>{`
        .free-date {
          background-color: green !important;
          color: white !important;
        }
        .occupied-date {
          background-color: red !important;
          color: white !important;
        }
      `}</style>
    </Grid>
  )
}

export default DateAvailabilityView;
