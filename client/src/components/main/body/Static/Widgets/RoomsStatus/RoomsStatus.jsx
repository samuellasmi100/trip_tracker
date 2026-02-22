import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector } from "react-redux";
import { Box, CircularProgress, Typography, Tabs, Tab } from "@mui/material";
import RoomsStatusView from "./RoomsStatus.view";
import RoomDetailPanel from "./RoomDetailPanel";
import AssignFamilyDialog from "./AssignFamilyDialog";
import MoveRoomDialog from "./MoveRoomDialog";
import RoomRoster from "./RoomRoster";
import RoomStatusOverview from "./RoomStatusOverview";
import ApiRooms from "../../../../../../apis/roomsRequest";

export const FAMILY_COLORS = [
  { bg: "#dbeafe", text: "#1d4ed8", border: "#93c5fd" },
  { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7" },
  { bg: "#fef3c7", text: "#92400e", border: "#fcd34d" },
  { bg: "#ede9fe", text: "#5b21b6", border: "#c4b5fd" },
  { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" },
  { bg: "#cffafe", text: "#155e75", border: "#67e8f9" },
  { bg: "#ffedd5", text: "#9a3412", border: "#fdba74" },
  { bg: "#ecfccb", text: "#3f6212", border: "#a3e635" },
  { bg: "#fce7f3", text: "#9d174d", border: "#f9a8d4" },
  { bg: "#ccfbf1", text: "#134e4a", border: "#5eead4" },
  { bg: "#e0e7ff", text: "#3730a3", border: "#a5b4fc" },
  { bg: "#f3e8ff", text: "#6b21a8", border: "#d8b4fe" },
  { bg: "#dcfce7", text: "#14532d", border: "#86efac" },
  { bg: "#fefce8", text: "#713f12", border: "#fde047" },
  { bg: "#ffe4e6", text: "#9f1239", border: "#fda4af" },
  { bg: "#e0f2fe", text: "#0c4a6e", border: "#7dd3fc" },
  { bg: "#fdf4ff", text: "#701a75", border: "#e879f9" },
  { bg: "#f1f5f9", text: "#334155", border: "#94a3b8" },
];

const generateDateRange = (startDate, endDate) => {
  const hebrewDays = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  const today = new Date().toISOString().split("T")[0];
  const dates = [];
  const current = new Date(startDate);
  const end = new Date(endDate);
  while (current <= end) {
    const dateStr = current.toISOString().split("T")[0];
    const dayName = hebrewDays[current.getDay()];
    const dd = String(current.getDate()).padStart(2, "0");
    const mm = String(current.getMonth() + 1).padStart(2, "0");
    dates.push({
      dateStr,
      dayName,
      dateNum: `${dd}/${mm}`,
      isWeekend: current.getDay() === 5 || current.getDay() === 6,
      isToday: dateStr === today,
    });
    current.setDate(current.getDate() + 1);
  }
  return dates;
};

const RoomsStatus = () => {
  const vacationId = useSelector((s) => s.vacationSlice.vacationId);
  const vacationsDates = useSelector((s) => s.vacationSlice.vacationsDates);
  const token = sessionStorage.getItem("token");

  const [boardData, setBoardData] = useState({
    rooms: [],
    bookings: [],
    guestAssignments: [],
    allGuests: [],
  });
  const [loading, setLoading] = useState(true); // true from the start so skeleton shows immediately
  const [activeTab, setActiveTab] = useState(0);
  const [selectedRoomIds, setSelectedRoomIds] = useState(new Set());
  const [detailPanel, setDetailPanel] = useState({ open: false, booking: null, room: null });
  const [assignDialog, setAssignDialog] = useState({ open: false, roomIds: [] });
  const [moveDialog, setMoveDialog] = useState({ open: false, booking: null });

  const dateRange = useMemo(() => {
    if (!vacationsDates || vacationsDates.length === 0) return [];
    const start = vacationsDates[0].start_date;
    let end = vacationsDates[vacationsDates.length - 1].end_date;
    if (!end) end = vacationsDates[vacationsDates.length - 2]?.end_date;
    if (!start || !end) return [];
    return generateDateRange(start, end);
  }, [vacationsDates]);

  const familyColorMap = useMemo(() => {
    const map = {};
    let idx = 0;
    boardData.bookings.forEach((b) => {
      if (!map[b.family_id]) {
        map[b.family_id] = FAMILY_COLORS[idx % FAMILY_COLORS.length];
        idx++;
      }
    });
    return map;
  }, [boardData.bookings]);

  const refreshBoard = useCallback(async () => {
    if (!vacationId) return;
    setLoading(true);
    try {
      const res = await ApiRooms.getBoardData(token, vacationId);
      setBoardData(res.data);
    } catch (err) {
      console.error("Failed to load board data", err);
    } finally {
      setLoading(false);
    }
  }, [vacationId, token]);

  useEffect(() => {
    refreshBoard();
  }, [refreshBoard]);

  // ── Handlers — all wrapped in useCallback so RoomsStatusView (React.memo) ──
  // ── doesn't re-render when unrelated state (dialogs) changes.            ──

  const handleRoomCheckbox = useCallback((roomId) => {
    setSelectedRoomIds((prev) => {
      const next = new Set(prev);
      if (next.has(roomId)) next.delete(roomId);
      else next.add(roomId);
      return next;
    });
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedRoomIds(new Set());
  }, []);

  const handleSelectAllRooms = useCallback((rooms) => {
    setSelectedRoomIds(new Set(rooms.map((r) => r.rooms_id)));
  }, []);

  const handleOccupiedCellClick = useCallback((booking, room) => {
    setDetailPanel({ open: true, booking, room });
  }, []);

  const handleEmptyCellClick = useCallback((roomId) => {
    setAssignDialog({ open: true, roomIds: [roomId] });
  }, []);

  // Receives the roomIds array from the view (avoids needing selectedRoomIds as dep)
  const handleOpenAssignDialog = useCallback((roomIds) => {
    setAssignDialog({ open: true, roomIds });
  }, []);

  const handleAssignFamily = async (familyId, roomIds, startDate, endDate) => {
    try {
      const existingRoomIds = new Set(
        boardData.bookings
          .filter((b) => b.family_id === familyId)
          .map((b) => b.room_id)
      );
      const allRooms = [
        ...boardData.bookings
          .filter((b) => b.family_id === familyId)
          .map((b) => ({ rooms_id: b.room_id })),
        ...roomIds
          .filter((id) => !existingRoomIds.has(id))
          .map((id) => ({ rooms_id: id })),
      ];
      await ApiRooms.assignRoom(token, allRooms, familyId, vacationId, startDate, endDate);
      setSelectedRoomIds(new Set());
      setAssignDialog({ open: false, roomIds: [] });
      await refreshBoard();
    } catch (err) {
      console.error("Failed to assign family to rooms", err);
    }
  };

  const handleGuestToggle = async (userId, roomId, familyId, checked) => {
    try {
      await ApiRooms.assignRoomToGroupOfUser(
        token,
        { userId, roomsId: roomId, familyId, status: checked },
        vacationId
      );
      await refreshBoard();
    } catch (err) {
      console.error("Failed to toggle guest room assignment", err);
    }
  };

  const handleMoveRoom = async (familyId, fromRoomId, toRoomId) => {
    try {
      await ApiRooms.moveRoom(token, { vacationId, familyId, fromRoomId, toRoomId });
      setMoveDialog({ open: false, booking: null });
      setDetailPanel({ open: false, booking: null, room: null });
      await refreshBoard();
    } catch (err) {
      console.error("Failed to move room", err);
    }
  };

  // Show a full-screen loader while the initial board data is fetching.
  // This lives in the container (not the memoized view) so it always renders.
  const isInitialLoad = loading && boardData.rooms.length === 0;

  return (
    <>
      {isInitialLoad ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            minHeight: 300,
            gap: 2,
          }}
        >
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body2" sx={{ color: "#64748b" }}>
            טוען נתוני חדרים…
          </Typography>
        </Box>
      ) : (
        <>
          <Box sx={{ borderBottom: "1px solid #e2e8f0" }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{ minHeight: 38, "& .MuiTab-root": { minHeight: 38, fontSize: 13, textTransform: "none", fontWeight: 600 } }}
            >
              <Tab label="לוח חדרים" />
              <Tab label="שיבוץ לצ'ק-אין" />
              <Tab label="סטטוס" />
            </Tabs>
          </Box>

          {/* Keep all tabs mounted (display:none) so the 1500-cell grid never
              unmounts — switching back would otherwise cause a multi-second freeze */}
          <Box sx={{ display: activeTab === 0 ? "block" : "none" }}>
            <RoomsStatusView
              boardData={boardData}
              dateRange={dateRange}
              selectedRoomIds={selectedRoomIds}
              familyColorMap={familyColorMap}
              loading={loading}
              onRoomCheckbox={handleRoomCheckbox}
              onClearSelection={handleClearSelection}
              onSelectAll={handleSelectAllRooms}
              onOccupiedCellClick={handleOccupiedCellClick}
              onEmptyCellClick={handleEmptyCellClick}
              onAssignSelectedRooms={handleOpenAssignDialog}
            />
          </Box>
          <Box sx={{ display: activeTab === 1 ? "block" : "none" }}>
            <RoomRoster boardData={boardData} />
          </Box>
          <Box sx={{ display: activeTab === 2 ? "block" : "none" }}>
            <RoomStatusOverview boardData={boardData} />
          </Box>
        </>
      )}

      <RoomDetailPanel
        open={detailPanel.open}
        booking={detailPanel.booking}
        room={detailPanel.room}
        boardData={boardData}
        familyColorMap={familyColorMap}
        onClose={() => setDetailPanel({ open: false, booking: null, room: null })}
        onGuestToggle={handleGuestToggle}
        onMoveRoom={(booking) => setMoveDialog({ open: true, booking })}
      />

      <AssignFamilyDialog
        open={assignDialog.open}
        roomIds={assignDialog.roomIds}
        boardData={boardData}
        vacationId={vacationId}
        token={token}
        onClose={() => setAssignDialog({ open: false, roomIds: [] })}
        onAssign={handleAssignFamily}
      />

      <MoveRoomDialog
        open={moveDialog.open}
        booking={moveDialog.booking}
        vacationId={vacationId}
        token={token}
        onClose={() => setMoveDialog({ open: false, booking: null })}
        onMove={handleMoveRoom}
      />
    </>
  );
};

export default RoomsStatus;
