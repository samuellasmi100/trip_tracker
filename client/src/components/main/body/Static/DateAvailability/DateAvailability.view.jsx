import { Grid, Select, InputLabel, MenuItem, OutlinedInput } from "@mui/material";
import React from "react";
import { useStyles } from "./DateAvailability.style"
import { useSelector } from "react-redux";




const TableComponent = ({ roomIds, dateRange }) => {
  return (
    <table border="1">
      <thead>
        <tr>
          <th>Room ID</th>
          {dateRange.map((date, index) => (
            <th key={index}>{date}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {roomIds.map((roomId, rowIndex) => (
          <tr key={rowIndex}>
            <td>{roomId}</td>
            {dateRange.map((_, colIndex) => (
              <td key={colIndex}></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const generateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateRange = [];

  while (start <= end) {
    dateRange.push(new Date(start).toISOString().split('T')[0]); // Format: YYYY-MM-DD
    start.setDate(start.getDate() + 1);
  }

  return dateRange;
};

function DateAvailabilityView({gaps}) {
  console.log("fffffffffffffffff")
  const roomIds = ["101", "102", "103"];
  const startDate = "2025-04-10";
  const endDate = "2025-04-21";
  const dateRange = generateDateRange(startDate, endDate);


  return <TableComponent roomIds={roomIds} dateRange={dateRange} />;
   
  
}

export default DateAvailabilityView;
