import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import React from "react";
import { useStyles } from "./DateAvailability.style"
import { useSelector } from "react-redux";


function DateAvailabilityView({dateRange,gaps}) {
  const classes = useStyles();
  const rooms = useSelector((state) => state.roomsSlice.rooms);

  let roomsId = rooms.map((key) => {
    return key.rooms_id
  })


  const reformatDate = (date) => {
    const [day, month, weekday] = date.split(" ");
    return `${day.padStart(2, '0')} ${month}`; 
  };

  const isDateAvailable = (date1,roomId) => {
     
     if(gaps[roomId] === undefined){
        return true
      }else {
        const format = reformatDate(date1)
        const [day, date] = format.split(" ");
        const formattedCheckString = `${date} ${day}`;
        if(gaps[roomId]?.includes(String(formattedCheckString))){
          console.log(formattedCheckString,roomId)
         return true
        }else {
          // console.log(formattedCheckString,roomId)
          return false
        }
      }
    };


  return(
    <TableContainer
    style={{
     width:"99.9%"
    }}>
    <Table stickyHeader style={{ width: "inherit" }} size="small">
      <TableHead>
        <TableRow>
          <TableCell  className={classes.headerTableRow}>מספר חדר</TableCell>
          {dateRange.map((date, index) => (
            <TableCell key={index}
            className={classes.headerTableRow}
            style={{ textAlign: "center" }}>
              {date}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody className={classes.dataTableBody} >
        {roomsId.map((roomId, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell className={classes.dataTableCell}>{roomId}</TableCell>
            {dateRange.map((date, index) => {
                const isAvailable = isDateAvailable(date, roomId);
                return (
                  <TableCell
                   className={classes.dataTableCell}
                    key={index}
                    style={{
                      backgroundColor: isAvailable ? 'green' : 'red',
                    }}
                  >
               </TableCell>
                );
              })}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  </TableContainer>
  )
}

export default DateAvailabilityView;
