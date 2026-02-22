import React, { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HotelIcon from "@mui/icons-material/Hotel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PeopleIcon from "@mui/icons-material/People";

// ── Small stat card ───────────────────────────────────────────────────────────
const StatCard = ({ icon, label, value, color, subLabel, onClick }) => (
  <Paper
    elevation={0}
    onClick={onClick}
    sx={{
      border: `1px solid ${color}30`,
      borderRadius: 2,
      p: 1.5,
      flex: 1,
      minWidth: 110,
      backgroundColor: `${color}0a`,
      ...(onClick && {
        cursor: "pointer",
        transition: "all 150ms ease",
        "&:hover": {
          boxShadow: `0 2px 8px ${color}25`,
          borderColor: `${color}60`,
        },
      }),
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
      {icon}
      <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 600, lineHeight: 1.2 }}>
        {label}
      </Typography>
    </Box>
    <Typography variant="h4" sx={{ fontWeight: 800, color, lineHeight: 1 }}>
      {value}
    </Typography>
    {subLabel && (
      <Typography variant="caption" sx={{ color: "#94a3b8" }}>
        {subLabel}
      </Typography>
    )}
  </Paper>
);

// ── Section heading with optional count badge ─────────────────────────────────
const SectionTitle = ({ label, count, color = "#334155" }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1, mt: 2.5 }}>
    <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
      {label}
    </Typography>
    {count !== undefined && (
      <Chip
        label={count}
        size="small"
        sx={{ height: 18, fontSize: 11, backgroundColor: `${color}18`, color }}
      />
    )}
  </Box>
);

// ── Main component ────────────────────────────────────────────────────────────
const RoomStatusOverview = ({ boardData }) => {
  const { rooms, bookings, guestAssignments, allGuests } = boardData;

  // Rooms that have at least one booking (family assigned)
  const bookedRoomIds = useMemo(
    () => new Set(bookings.map((b) => b.room_id)),
    [bookings]
  );

  // Guests that have been assigned to any room
  const assignedUserIds = useMemo(
    () => new Set(guestAssignments.map((a) => a.user_id)),
    [guestAssignments]
  );

  // Guest count per room
  const guestCountByRoom = useMemo(() => {
    const map = {};
    guestAssignments.forEach((a) => {
      map[a.room_id] = (map[a.room_id] || 0) + 1;
    });
    return map;
  }, [guestAssignments]);

  const occupiedRooms = rooms.filter((r) => bookedRoomIds.has(r.rooms_id));
  const freeRooms = rooms.filter((r) => !bookedRoomIds.has(r.rooms_id));

  // Rooms with a family booking but 0 individual guest assignments
  const roomsMissingGuests = useMemo(
    () => occupiedRooms.filter((r) => !guestCountByRoom[r.rooms_id]),
    [occupiedRooms, guestCountByRoom]
  );

  // Rooms where assigned guests exceed capacity
  const overCapacityRooms = useMemo(
    () =>
      rooms
        .map((r) => ({
          ...r,
          capacity: parseInt(r.base_occupancy || 0) + parseInt(r.max_occupancy || 0),
          count: guestCountByRoom[r.rooms_id] || 0,
          booking: bookings.find((b) => b.room_id === r.rooms_id),
        }))
        .filter((r) => r.capacity > 0 && r.count > r.capacity),
    [rooms, guestCountByRoom, bookings]
  );

  // Guests not assigned to any room
  const unassignedGuests = useMemo(
    () => (allGuests || []).filter((g) => !assignedUserIds.has(g.user_id)),
    [allGuests, assignedUserIds]
  );

  // Floor breakdown
  const floorBreakdown = useMemo(() => {
    const map = {};
    rooms.forEach((r) => {
      const floor = r.floor != null && r.floor !== "" ? r.floor : "—";
      if (!map[floor]) map[floor] = { total: 0, occupied: 0, guests: 0 };
      map[floor].total++;
      if (bookedRoomIds.has(r.rooms_id)) {
        map[floor].occupied++;
        map[floor].guests += guestCountByRoom[r.rooms_id] || 0;
      }
    });
    return Object.entries(map).sort(([a], [b]) =>
      String(a).localeCompare(String(b), undefined, { numeric: true })
    );
  }, [rooms, bookedRoomIds, guestCountByRoom]);

  const totalProblems =
    roomsMissingGuests.length + overCapacityRooms.length + unassignedGuests.length;

  // Modal state
  const [openModal, setOpenModal] = useState(null); // "free" | "problems" | null

  return (
    <Box sx={{ p: 2, direction: "rtl", overflow: "auto", maxHeight: "calc(100vh - 130px)" }}>

      {/* ── Summary cards ── */}
      <Box sx={{ display: "flex", gap: 1.5, mb: 1, flexWrap: "wrap" }}>
        <StatCard
          icon={<HotelIcon sx={{ fontSize: 17, color: "#2563eb" }} />}
          label="סה״כ חדרים"
          value={rooms.length}
          color="#2563eb"
        />
        <StatCard
          icon={<CheckCircleIcon sx={{ fontSize: 17, color: "#16a34a" }} />}
          label="מאוכלסים"
          value={occupiedRooms.length}
          color="#16a34a"
          subLabel={rooms.length ? `${Math.round((occupiedRooms.length / rooms.length) * 100)}%` : ""}
        />
        <StatCard
          icon={<MeetingRoomIcon sx={{ fontSize: 17, color: "#0891b2" }} />}
          label="פנויים"
          value={freeRooms.length}
          color="#0891b2"
          onClick={() => setOpenModal("free")}
        />
        <StatCard
          icon={<PeopleIcon sx={{ fontSize: 17, color: "#7c3aed" }} />}
          label="אורחים משובצים"
          value={guestAssignments.length}
          color="#7c3aed"
          subLabel={allGuests?.length ? `מתוך ${allGuests.length}` : ""}
        />
        <StatCard
          icon={<WarningAmberIcon sx={{ fontSize: 17, color: totalProblems > 0 ? "#dc2626" : "#16a34a" }} />}
          label="פריטים לטיפול"
          value={totalProblems}
          color={totalProblems > 0 ? "#dc2626" : "#16a34a"}
          onClick={() => setOpenModal("problems")}
        />
      </Box>

      {/* ── Unassigned guests ── */}
      <SectionTitle
        label="אורחים ללא שיבוץ לחדר"
        count={unassignedGuests.length}
        color="#7c3aed"
      />
      {unassignedGuests.length === 0 ? (
        <Alert severity="success" sx={{ mb: 1, py: 0.5, fontSize: 12 }}>
          כל האורחים שובצו לחדר ✓
        </Alert>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1 }}>
          {unassignedGuests.map((g) => (
            <Chip
              key={g.user_id}
              label={`${g.hebrew_first_name} ${g.hebrew_last_name}`}
              size="small"
              sx={{
                backgroundColor: "#f3e8ff",
                color: "#6b21a8",
                border: "1px solid #d8b4fe",
                fontSize: 11,
              }}
            />
          ))}
        </Box>
      )}

      {/* ── Over-capacity rooms ── */}
      <SectionTitle
        label="חדרים בעודף תפוסה"
        count={overCapacityRooms.length}
        color="#dc2626"
      />
      {overCapacityRooms.length === 0 ? (
        <Alert severity="success" sx={{ mb: 1, py: 0.5, fontSize: 12 }}>
          אין חדרים בעודף תפוסה ✓
        </Alert>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1 }}>
          {overCapacityRooms.map((r) => (
            <Chip
              key={r.rooms_id}
              label={`חדר ${r.rooms_id} — ${r.count}/${r.capacity} אורחים (${r.booking?.family_name || ""})`}
              sx={{
                backgroundColor: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #fca5a5",
                fontSize: 12,
              }}
            />
          ))}
        </Box>
      )}

      {/* ── Floor breakdown ── */}
      <SectionTitle label="סיכום לפי קומות" color="#475569" />
      <TableContainer
        component={Paper}
        elevation={0}
        sx={{ border: "1px solid #e2e8f0", borderRadius: "8px", mb: 2 }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>קומה</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>סה״כ חדרים</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>מאוכלסים</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>פנויים</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>אורחים</TableCell>
              <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>תפוסה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {floorBreakdown.map(([floor, data]) => {
              const pct = Math.round((data.occupied / data.total) * 100);
              return (
                <TableRow key={floor} hover>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {floor !== "—" ? `קומה ${floor}` : "ללא קומה"}
                  </TableCell>
                  <TableCell>{data.total}</TableCell>
                  <TableCell>
                    <Chip
                      label={data.occupied}
                      size="small"
                      sx={{ backgroundColor: "#dcfce7", color: "#166534", fontSize: 11, height: 20 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={data.total - data.occupied}
                      size="small"
                      sx={{ backgroundColor: "#f0f9ff", color: "#0369a1", fontSize: 11, height: 20 }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{data.guests}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Box
                        sx={{
                          width: 56,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: "#e2e8f0",
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            width: `${pct}%`,
                            height: "100%",
                            backgroundColor: pct === 100 ? "#16a34a" : "#2563eb",
                            borderRadius: 3,
                          }}
                        />
                      </Box>
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {pct}%
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Free Rooms Modal ── */}
      <Dialog
        open={openModal === "free"}
        onClose={() => setOpenModal(null)}
        PaperProps={{
          sx: {
            borderRadius: "14px",
            minWidth: "480px",
            maxWidth: "90vw",
            maxHeight: "80vh",
            direction: "rtl",
          },
        }}
      >
        <DialogTitle sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          borderBottom: "1px solid #e2e8f0",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MeetingRoomIcon sx={{ fontSize: 20, color: "#0891b2" }} />
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
              חדרים פנויים ({freeRooms.length})
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpenModal(null)}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {freeRooms.length === 0 ? (
            <Alert severity="info" sx={{ mt: 1, fontSize: 12 }}>אין חדרים פנויים</Alert>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e2e8f0", borderRadius: "8px", mt: 1 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>מספר חדר</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>קומה</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>תפוסה בסיסית</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#f8fafc" }}>תפוסה מקסימלית</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {freeRooms.map((r) => (
                    <TableRow key={r.rooms_id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{r.rooms_id}</TableCell>
                      <TableCell>{r.floor || "—"}</TableCell>
                      <TableCell>{r.base_occupancy || "—"}</TableCell>
                      <TableCell>{r.max_occupancy || "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Problems Modal ── */}
      <Dialog
        open={openModal === "problems"}
        onClose={() => setOpenModal(null)}
        PaperProps={{
          sx: {
            borderRadius: "14px",
            minWidth: "520px",
            maxWidth: "90vw",
            maxHeight: "80vh",
            direction: "rtl",
          },
        }}
      >
        <DialogTitle sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          borderBottom: "1px solid #e2e8f0",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <WarningAmberIcon sx={{ fontSize: 20, color: totalProblems > 0 ? "#dc2626" : "#16a34a" }} />
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
              פריטים לטיפול ({totalProblems})
            </Typography>
          </Box>
          <IconButton size="small" onClick={() => setOpenModal(null)}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {totalProblems === 0 ? (
            <Alert severity="success" sx={{ mt: 1, fontSize: 12 }}>אין פריטים לטיפול — הכל תקין ✓</Alert>
          ) : (
            <>
              {/* Rooms with family but no guest assignments */}
              {roomsMissingGuests.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>
                      חדרים עם משפחה — ללא שיבוץ אורחים
                    </Typography>
                    <Chip label={roomsMissingGuests.length} size="small" sx={{ height: 18, fontSize: 11, backgroundColor: "#fef3c7", color: "#92400e" }} />
                  </Box>
                  <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #fcd34d", borderRadius: "8px" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#fffbeb" }}>חדר</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#fffbeb" }}>קומה</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#fffbeb" }}>משפחה</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {roomsMissingGuests.map((r) => {
                          const booking = bookings.find((b) => b.room_id === r.rooms_id);
                          return (
                            <TableRow key={r.rooms_id} hover>
                              <TableCell sx={{ fontWeight: 600 }}>{r.rooms_id}</TableCell>
                              <TableCell>{r.floor || "—"}</TableCell>
                              <TableCell>{booking?.family_name || "—"}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Unassigned guests */}
              {unassignedGuests.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#6b21a8" }}>
                      אורחים ללא שיבוץ לחדר
                    </Typography>
                    <Chip label={unassignedGuests.length} size="small" sx={{ height: 18, fontSize: 11, backgroundColor: "#f3e8ff", color: "#6b21a8" }} />
                  </Box>
                  <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #d8b4fe", borderRadius: "8px" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#faf5ff" }}>משפחה</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#faf5ff" }}>שם</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {unassignedGuests.map((g) => (
                          <TableRow key={g.user_id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>{g.family_name || "—"}</TableCell>
                            <TableCell>{g.hebrew_first_name} {g.hebrew_last_name}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}

              {/* Over-capacity rooms */}
              {overCapacityRooms.length > 0 && (
                <Box sx={{ mb: 2.5 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#991b1b" }}>
                      חדרים בעודף תפוסה
                    </Typography>
                    <Chip label={overCapacityRooms.length} size="small" sx={{ height: 18, fontSize: 11, backgroundColor: "#fee2e2", color: "#991b1b" }} />
                  </Box>
                  <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #fca5a5", borderRadius: "8px" }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#fef2f2" }}>משפחה</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#fef2f2" }}>חדר</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#fef2f2" }}>קומה</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: 12, backgroundColor: "#fef2f2" }}>אורחים / קיבולת</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {overCapacityRooms.map((r) => (
                          <TableRow key={r.rooms_id} hover>
                            <TableCell sx={{ fontWeight: 600 }}>{r.booking?.family_name || "—"}</TableCell>
                            <TableCell>{r.rooms_id}</TableCell>
                            <TableCell>{r.floor || "—"}</TableCell>
                            <TableCell>
                              <Chip
                                label={`${r.count} / ${r.capacity}`}
                                size="small"
                                sx={{ backgroundColor: "#fee2e2", color: "#991b1b", fontSize: 11, height: 20, fontWeight: 700 }}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default RoomStatusOverview;
