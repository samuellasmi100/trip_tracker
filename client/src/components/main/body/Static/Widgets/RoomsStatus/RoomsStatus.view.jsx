import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Tooltip,
  Button,
  CircularProgress,
} from "@mui/material";
import { useStyles } from "./RoomsStatus.style";

const DAY_SHORT = {
  ראשון: "א׳",
  שני: "ב׳",
  שלישי: "ג׳",
  רביעי: "ד׳",
  חמישי: "ה׳",
  שישי: "ו׳",
  שבת: "ש׳",
};

// ─── Main grid component ─────────────────────────────────────────────────────
// Wrapped with React.memo so it only re-renders when its own props change.
// This means opening dialogs (which live in the parent) does NOT cause the
// 1,500-cell grid to re-render — eliminating the 3-second click delay.
function RoomsStatusView({
  boardData,
  dateRange,
  selectedRoomIds,
  familyColorMap,
  loading,
  onRoomCheckbox,
  onClearSelection,
  onSelectAll,
  onOccupiedCellClick,
  onEmptyCellClick,
  onAssignSelectedRooms,
}) {
  const classes = useStyles();
  const { rooms, bookings, guestAssignments } = boardData;

  // ── O(1) booking lookup: bookingMap[roomId][dateStr] = booking ─────────────
  // Replaces the previous O(bookings) linear search per cell.
  // Recomputed only when the bookings array changes.
  const bookingMap = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      if (!map[b.room_id]) map[b.room_id] = {};
      const curr = new Date(b.start_date);
      const end = new Date(b.end_date);
      while (curr <= end) {
        map[b.room_id][curr.toISOString().split("T")[0]] = b;
        curr.setDate(curr.getDate() + 1);
      }
    });
    return map;
  }, [bookings]);

  // ── O(1) guest lookup: guestsByRoom["roomId::familyId"] = [guests] ─────────
  const guestsByRoom = useMemo(() => {
    const map = {};
    guestAssignments.forEach((a) => {
      const key = `${a.room_id}::${a.family_id}`;
      if (!map[key]) map[key] = [];
      map[key].push(a);
    });
    return map;
  }, [guestAssignments]);

  // ── Flat guest list per room (all families): roomId → [firstName, ...] ─────
  const guestsByRoomFlat = useMemo(() => {
    const map = {};
    guestAssignments.forEach((a) => {
      if (!map[a.room_id]) map[a.room_id] = [];
      map[a.room_id].push(a.hebrew_first_name);
    });
    return map;
  }, [guestAssignments]);

  const findBooking = (roomId, dateStr) => bookingMap[roomId]?.[dateStr] || null;
  const getGuestsInRoom = (roomId, familyId) => guestsByRoom[`${roomId}::${familyId}`] || [];

  const buildTooltip = (booking, roomId, room) => {
    if (!booking) return "לחץ לשיבוץ משפחה";
    const guests = getGuestsInRoom(roomId, booking.family_id);
    const capacity =
      parseInt(room?.base_occupancy || 0) + parseInt(room?.max_occupancy || 0);
    const guestNames =
      guests.length > 0
        ? guests.map((g) => `${g.hebrew_first_name} ${g.hebrew_last_name}`).join(", ")
        : "אין אורחים משובצים";
    return `${booking.family_name} (${guests.length}/${capacity}) • ${guestNames}`;
  };

  return (
    <div className={classes.wrapper}>
      {/* ── Toolbar ─────────────────────────────────────────── */}
      <div className={classes.toolbar}>
        <div className={classes.legend}>
          <div className={classes.legendItem}>
            <div className={classes.legendDot} style={{ backgroundColor: "#d1fae5", border: "1px solid #6ee7b7" }} />
            <span>פנוי</span>
          </div>
          <div className={classes.legendItem}>
            <div className={classes.legendDot} style={{ backgroundColor: "#dbeafe", border: "1px solid #93c5fd" }} />
            <span>תפוס (צבע לפי משפחה)</span>
          </div>
          {/* Subtle refresh indicator — does NOT block interaction */}
          {loading && (
            <CircularProgress size={14} thickness={5} sx={{ ml: 1, color: "#94a3b8" }} />
          )}
        </div>

        {selectedRoomIds.size > 0 && (
          <div className={classes.selectionBar}>
            <span className={classes.selectionCount}>{selectedRoomIds.size} חדרים נבחרו</span>
            <Button
              variant="contained"
              size="small"
              onClick={() => onAssignSelectedRooms([...selectedRoomIds])}
              className={classes.assignBtn}
            >
              שייך לחברה
            </Button>
            <Button size="small" onClick={onClearSelection} className={classes.cancelBtn}>
              ביטול
            </Button>
          </div>
        )}
      </div>

      {/* ── Grid ────────────────────────────────────────────── */}
      <TableContainer className={classes.tableWrap}>
        <Table className={classes.table} size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell className={classes.cornerHeader}>
                <div className={classes.cornerContent}>
                  <Checkbox
                    size="small"
                    indeterminate={
                      selectedRoomIds.size > 0 && selectedRoomIds.size < rooms.length
                    }
                    checked={rooms.length > 0 && selectedRoomIds.size === rooms.length}
                    onChange={() => {
                      if (selectedRoomIds.size === rooms.length) {
                        onClearSelection();
                      } else {
                        onSelectAll(rooms);
                      }
                    }}
                    sx={{ p: 0, mr: 0.5 }}
                  />
                  חדר
                </div>
              </TableCell>

              {dateRange.map((d) => (
                <TableCell
                  key={d.dateStr}
                  className={[
                    classes.dateHeader,
                    d.isWeekend ? classes.weekendHeader : "",
                    d.isToday ? classes.todayHeader : "",
                  ].join(" ")}
                >
                  <div className={classes.dateHeaderDay}>{DAY_SHORT[d.dayName] || d.dayName}</div>
                  <div className={classes.dateHeaderNum}>{d.dateNum}</div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rooms.map((room) => {
              const isSelected = selectedRoomIds.has(room.rooms_id);
              return (
                <TableRow
                  key={room.rooms_id}
                  className={isSelected ? classes.selectedRow : ""}
                >
                  <TableCell className={classes.roomCell}>
                    <div className={classes.roomCellContent}>
                      <Checkbox
                        size="small"
                        checked={isSelected}
                        onChange={() => onRoomCheckbox(room.rooms_id)}
                        sx={{ p: 0, mr: 0.5, flexShrink: 0 }}
                      />
                      <div className={classes.roomInfo}>
                        <div className={classes.roomIdRow}>
                          <span className={classes.roomId}>{room.rooms_id}</span>
                          {room.floor && (
                            <span className={classes.roomFloor}>ק{room.floor}</span>
                          )}
                        </div>
                        {guestsByRoomFlat[room.rooms_id]?.length > 0 && (
                          <div className={classes.roomGuestNames}>
                            {guestsByRoomFlat[room.rooms_id].slice(0, 2).join(" • ")}
                            {guestsByRoomFlat[room.rooms_id].length > 2 && (
                              <span className={classes.roomGuestMore}>
                                {" "}+{guestsByRoomFlat[room.rooms_id].length - 2}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {dateRange.map((d) => {
                    const booking = findBooking(room.rooms_id, d.dateStr);
                    const color = booking ? familyColorMap[booking.family_id] : null;
                    const showLabel = !!booking;
                    const guests = booking
                      ? getGuestsInRoom(room.rooms_id, booking.family_id)
                      : [];
                    const capacity =
                      parseInt(room.base_occupancy || 0) +
                      parseInt(room.max_occupancy || 0);

                    return (
                      <Tooltip
                        key={d.dateStr}
                        title={buildTooltip(booking, room.rooms_id, room)}
                        arrow
                        placement="top"
                        enterDelay={400}
                        enterNextDelay={200}
                      >
                        <TableCell
                          className={[
                            classes.dayCell,
                            !booking ? classes.available : "",
                            d.isWeekend ? classes.weekendCol : "",
                            d.isToday ? classes.todayCol : "",
                          ].join(" ")}
                          style={
                            booking
                              ? {
                                  backgroundColor: color?.bg,
                                  borderBottom: `1px solid ${color?.border}`,
                                  borderLeft: `1px solid ${color?.border}`,
                                  cursor: "pointer",
                                }
                              : { cursor: "pointer" }
                          }
                          onClick={() =>
                            booking
                              ? onOccupiedCellClick(booking, room)
                              : onEmptyCellClick(room.rooms_id)
                          }
                        >
                          {showLabel && (
                            <div
                              className={classes.bookingLabel}
                              style={{ color: color?.text }}
                            >
                              {booking.family_name.length > 5
                                ? booking.family_name.slice(0, 5) + "…"
                                : booking.family_name}
                              {capacity > 0 && (
                                <span className={classes.bookingCapacity}>
                                  {" "}{guests.length}/{capacity}
                                </span>
                              )}
                            </div>
                          )}
                        </TableCell>
                      </Tooltip>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default React.memo(RoomsStatusView);
