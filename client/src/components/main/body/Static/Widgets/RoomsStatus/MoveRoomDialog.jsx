import React, { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ApiRooms from "../../../../../../apis/roomsRequest";

const MoveRoomDialog = ({ open, booking, vacationId, token, onClose, onMove }) => {
  const [availableRooms, setAvailableRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);

  useEffect(() => {
    if (open && booking) {
      setSelectedRoomId("");
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
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth dir="rtl">
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", gap: 1 }}>
        <SwapHorizIcon sx={{ color: "#2563eb" }} />
        העבר לחדר אחר
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
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

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : availableRooms.length === 0 ? (
          <Alert severity="warning" sx={{ fontSize: 13 }}>
            אין חדרים פנויים לתאריכים אלו
          </Alert>
        ) : (
          <FormControl fullWidth size="small">
            <InputLabel>בחר חדר יעד</InputLabel>
            <Select
              value={selectedRoomId}
              label="בחר חדר יעד"
              onChange={(e) => setSelectedRoomId(e.target.value)}
            >
              {availableRooms.map((room) => (
                <MenuItem key={room.rooms_id} value={room.rooms_id}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      חדר {room.rooms_id}
                      {room.floor ? ` · קומה ${room.floor}` : ""}
                    </Typography>
                    {room.type && (
                      <Typography variant="caption" sx={{ color: "#64748b" }}>
                        {room.type}
                        {room.base_occupancy ? ` · ${parseInt(room.base_occupancy) + parseInt(room.max_occupancy || 0)} מקומות` : ""}
                      </Typography>
                    )}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b" }}>
          ביטול
        </Button>
        <Button
          variant="contained"
          onClick={handleMove}
          disabled={!selectedRoomId || moving}
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
