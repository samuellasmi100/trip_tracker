import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Grid,
  Tooltip,
} from "@mui/material";
import React from "react";
import { useStyles } from "./RoomsStatus.style";
import { useSelector } from "react-redux";

function DateAvailabilityView({ dateRange, gaps }) {
  const classes = useStyles();
  const rooms = useSelector((state) => state.roomsSlice.rooms);

  const roomsId = rooms.map((key) => key.rooms_id);

  const reformatDate = (date) => {
    const [day, month] = date.split(" ");
    return `${day.padStart(2, "0")} ${month}`;
  };

  const isDateAvailable = (date1, roomId) => {
    if (gaps[roomId] === undefined) {
      return true;
    } else {
      const format = reformatDate(date1);
      const [day, date] = format.split(" ");
      const formattedCheckString = `${date} ${day}`;
      if (gaps[roomId]?.includes(String(formattedCheckString))) {
        return true;
      } else {
        return false;
      }
    }
  };

  // Parse "ראשון 04-08" → { dayName: "ראשון", dateNum: "04-08", isWeekend }
  const parseDateHeader = (dateStr) => {
    const parts = dateStr.split(" ");
    const dayName = parts[0];
    const dateNum = parts[1];
    const isWeekend = dayName === "שישי" || dayName === "שבת";
    return { dayName, dateNum, isWeekend };
  };

  // Abbreviate day names: ראשון→א׳, שני→ב׳, etc.
  const shortDay = (name) => {
    const map = {
      "ראשון": "א׳",
      "שני": "ב׳",
      "שלישי": "ג׳",
      "רביעי": "ד׳",
      "חמישי": "ה׳",
      "שישי": "ו׳",
      "שבת": "ש׳",
    };
    return map[name] || name;
  };

  return (
    <Grid className={classes.wrapper}>
      <Grid className={classes.toolbar}>
        <div className={classes.legend}>
          <div className={classes.legendItem}>
            <div
              className={classes.legendDot}
              style={{ backgroundColor: "#d1fae5" }}
            />
            <span>פנוי</span>
          </div>
          <div className={classes.legendItem}>
            <div
              className={classes.legendDot}
              style={{ backgroundColor: "#fecaca" }}
            />
            <span>תפוס</span>
          </div>
        </div>
      </Grid>

      <TableContainer className={classes.tableWrap}>
        <Table className={classes.table} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cornerHeader}>חדר</TableCell>
              {dateRange.map((date, index) => {
                const { dayName, dateNum, isWeekend } = parseDateHeader(date);
                return (
                  <TableCell
                    key={index}
                    className={`${classes.dateHeader} ${isWeekend ? classes.weekendHeader : ""}`}
                  >
                    <div className={classes.dateHeaderDay}>{shortDay(dayName)}</div>
                    <div className={classes.dateHeaderNum}>{dateNum}</div>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>

          <TableBody className={classes.dataTableBody}>
            {roomsId.map((roomId, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className={classes.roomCell}>{roomId}</TableCell>
                {dateRange.map((date, index) => {
                  const isAvailable = isDateAvailable(date, roomId);
                  const { isWeekend } = parseDateHeader(date);
                  return (
                    <Tooltip
                      key={index}
                      title={`חדר ${roomId} · ${date} · ${isAvailable ? "פנוי" : "תפוס"}`}
                      arrow
                      placement="top"
                      enterDelay={200}
                    >
                      <TableCell
                        className={`${classes.dayCell} ${isAvailable ? classes.available : classes.unavailable} ${isWeekend ? classes.weekendCol : ""}`}
                      />
                    </Tooltip>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  );
}

export default DateAvailabilityView;
