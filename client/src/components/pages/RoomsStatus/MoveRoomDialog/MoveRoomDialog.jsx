import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Alert,
  Paper,
  Chip,
  IconButton,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
import ApiRooms from "../../../../apis/roomsRequest";

const TEAL = "#0891b2";

const MoveRoomDialog = ({ open, booking, vacationId, token, onClose, onMove }) => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);

  const missingDates = !!booking && (!booking.start_date || !booking.end_date);

  useEffect(() => {
    if (open && booking) {
      setSelectedRoomId("");
      setAvailableRooms([]);
      if (!booking.start_date || !booking.end_date) return;
      setLoading(true);
      ApiRooms.getRoomAvailable(token, vacationId, booking.start_date, booking.end_date)
        .then((res) => {
          // Filter out the family's current room (can't move to where they already are)
          const rooms = (res.data || []).filter((r) => r.rooms_id !== booking.room_id);
          setAvailableRooms(rooms);
        })
        .catch((err) => console.error("Failed to load available rooms", err))
        .finally(() => setLoading(false));
    }
  }, [open, booking, vacationId, token]);

  const handleMove = async () => {
    if (!selectedRoomId) return;
    setMoving(true);
    try {
      await onMove(booking.family_id, booking.room_id, selectedRoomId);
    } finally {
      setMoving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "14px",
          direction: "rtl",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 1,
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <SwapHorizIcon sx={{ fontSize: 20, color: TEAL }} />
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
            העבר חדר זה לחדר אחר
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {booking && (
          <Box
            sx={{
              p: 1.5,
              mb: 2,
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              משפחת {booking.family_name}
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b" }}>
              חדר נוכחי: {booking.room_id} · {booking.start_date} — {booking.end_date}
            </Typography>
          </Box>
        )}

        {missingDates ? (
          <Alert severity="warning" sx={{ fontSize: 13 }}>
            אין תאריכי שהייה למשפחה
          </Alert>
        ) : loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : availableRooms.length === 0 ? (
          <Alert severity="warning" sx={{ fontSize: 13 }}>
            אין חדרים פנויים לתאריכים אלו
          </Alert>
        ) : (
          <Box
            sx={{
              maxHeight: 320,
              overflowY: "auto",
              border: "1px solid #e2e8f0",
              borderRadius: 2,
              p: 1,
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
              backgroundColor: "#ffffff",
            }}
          >
            {availableRooms.map((room) => {
              const selected = selectedRoomId === room.rooms_id;
              const capacity =
                parseInt(room.base_occupancy || 0) + parseInt(room.max_occupancy || 0);
              return (
                <Paper
                  key={room.rooms_id}
                  elevation={0}
                  onClick={() => setSelectedRoomId(room.rooms_id)}
                  sx={{
                    p: 1.25,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    cursor: "pointer",
                    borderRadius: 2,
                    border: `1px solid ${selected ? TEAL : `${TEAL}30`}`,
                    backgroundColor: selected ? `${TEAL}0a` : "#ffffff",
                    transition: "all 150ms ease",
                    "&:hover": {
                      boxShadow: `0 2px 8px ${TEAL}25`,
                      borderColor: selected ? TEAL : `${TEAL}60`,
                    },
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: "#1e293b" }}
                    >
                      חדר {room.rooms_id}
                      {room.floor ? ` · קומה ${room.floor}` : ""}
                    </Typography>
                    {room.type && (
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {room.type}
                      </Typography>
                    )}
                  </Box>
                  {capacity > 0 && (
                    <Chip
                      label={`${capacity} מקומות`}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: 11,
                        backgroundColor: selected ? `${TEAL}18` : "#f1f5f9",
                        color: selected ? TEAL : "#475569",
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Paper>
              );
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b" }}>
          ביטול
        </Button>
        <Button
          variant="contained"
          onClick={handleMove}
          disabled={!selectedRoomId || moving || missingDates}
          startIcon={moving ? <CircularProgress size={14} color="inherit" /> : <SwapHorizIcon />}
          sx={{ textTransform: "none", backgroundColor: "#2563eb" }}
        >
          העבר
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MoveRoomDialog;
