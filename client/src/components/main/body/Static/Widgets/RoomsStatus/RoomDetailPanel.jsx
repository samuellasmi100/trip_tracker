import React, { useState, useEffect, useMemo } from "react";
import {
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import RoomDetailPanelView from "./RoomDetailPanel.view";

const RoomDetailPanel = ({
  open,
  booking,
  room,
  boardData,
  familyColorMap,
  onClose,
  onGuestToggle,
  onMoveRoom,
  onRemoveFromRoom,
}) => {
  // Local pending checkbox state — userId → true/false (overrides DB state until saved)
  const [pendingChanges, setPendingChanges] = useState({});
  const [saving, setSaving] = useState(false);
  const [removeChoiceOpen, setRemoveChoiceOpen] = useState(false);
  // Single-room remove confirmation. Replaces window.confirm so the prompt
  // matches the styled multi-room dialog below.
  const [singleRemoveOpen, setSingleRemoveOpen] = useState(false);

  // Reset pending changes whenever the panel opens for a new room/booking
  useEffect(() => {
    if (open) {
      setPendingChanges({});
      setRemoveChoiceOpen(false);
      setSingleRemoveOpen(false);
    }
  }, [open, booking?.room_id, booking?.family_id]);

  // Compute derived data only when booking/room exist
  const allFamilyMembers = booking
    ? boardData.allGuests.filter((g) => g.family_id === booking.family_id)
    : [];

  const assignedToRoom = booking
    ? boardData.guestAssignments.filter(
        (a) => a.room_id === booking.room_id && a.family_id === booking.family_id
      )
    : [];

  const assignedUserIds = new Set(assignedToRoom.map((a) => a.user_id));

  // user_id → room_id for ALL guests in this family. Drives the
  // "משובץ בחדר N" hint shown next to guests currently placed in a
  // different room of the family's set. If a guest somehow appears in
  // multiple rooms (no DB-level uniqueness), the first one wins for the
  // display — the backend's UPDATE-or-INSERT logic normally prevents this.
  const guestCurrentRoomMap = useMemo(() => {
    if (!booking) return {};
    const map = {};
    boardData.guestAssignments.forEach((a) => {
      if (a.family_id === booking.family_id && map[a.user_id] === undefined) {
        map[a.user_id] = a.room_id;
      }
    });
    return map;
  }, [boardData.guestAssignments, booking?.family_id]);

  // How many rooms the family currently holds — drives the smart-prompt
  // behaviour of "הסר": 1 room → confirm + remove; 2+ rooms → choice dialog.
  const familyRoomCount = useMemo(() => {
    if (!booking) return 0;
    return boardData.bookings.filter((b) => b.family_id === booking.family_id).length;
  }, [boardData.bookings, booking?.family_id]);

  // Pending state takes precedence over the DB state
  const isChecked = (userId) => {
    if (pendingChanges[userId] !== undefined) return pendingChanges[userId];
    return assignedUserIds.has(userId);
  };

  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  const handleToggle = (userId) => {
    const original = assignedUserIds.has(userId);
    const newValue = !isChecked(userId);
    // If the new value matches the original DB value, remove from pending (no-op)
    if (newValue === original) {
      const updated = { ...pendingChanges };
      delete updated[userId];
      setPendingChanges(updated);
    } else {
      setPendingChanges((prev) => ({ ...prev, [userId]: newValue }));
    }
  };

  // Save all pending guest-assignment changes sequentially, refreshing the board after each
  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [userId, checked] of Object.entries(pendingChanges)) {
        await onGuestToggle(userId, booking.room_id, booking.family_id, checked);
      }
      setPendingChanges({});
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = () => {
    if (!booking) return;
    if (familyRoomCount >= 2) {
      setRemoveChoiceOpen(true);
      return;
    }
    // Single-room case: open the styled confirm dialog (same shell as the
    // multi-room choice dialog below) instead of the browser's window.confirm.
    setSingleRemoveOpen(true);
  };

  const handleSingleRemoveConfirm = () => {
    setSingleRemoveOpen(false);
    if (!booking) return;
    onRemoveFromRoom(booking.family_id, booking.room_id, "single");
  };

  const handleRemoveSingle = () => {
    setRemoveChoiceOpen(false);
    onRemoveFromRoom(booking.family_id, booking.room_id, "single");
  };

  const handleRemoveAll = () => {
    setRemoveChoiceOpen(false);
    onRemoveFromRoom(booking.family_id, booking.room_id, "all");
  };

  const capacity = room
    ? parseInt(room.base_occupancy || 0) + parseInt(room.max_occupancy || 0)
    : 0;
  const assignedCount = assignedToRoom.length;
  const familyColor = booking
    ? (familyColorMap[booking.family_id] || { bg: "#f1f5f9", text: "#334155", border: "#94a3b8" })
    : { bg: "#f1f5f9", text: "#334155", border: "#94a3b8" };

  return (
    <>
      {/* Drawer is always mounted so open/close animation works;
          content is only rendered when booking and room are present. */}
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { width: 320, direction: "rtl" } }}
      >
        {booking && room && (
          <RoomDetailPanelView
            booking={booking}
            room={room}
            allFamilyMembers={allFamilyMembers}
            guestCurrentRoomMap={guestCurrentRoomMap}
            isChecked={isChecked}
            onToggle={handleToggle}
            hasPendingChanges={hasPendingChanges}
            onSave={handleSave}
            saving={saving}
            onMoveRoom={() => onMoveRoom(booking)}
            onRemoveFromRoom={handleRemove}
            onClose={onClose}
            familyColor={familyColor}
            capacity={capacity}
            assignedCount={assignedCount}
          />
        )}
      </Drawer>

      {/* Multi-room remove choice — only shown when family is in 2+ rooms */}
      <Dialog
        open={removeChoiceOpen}
        onClose={() => setRemoveChoiceOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px", direction: "rtl" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pb: 1,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <PersonRemoveIcon sx={{ fontSize: 20, color: "#dc2626" }} />
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
            הסרת משפחה
          </Typography>
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
                החדר הנוכחי: {booking.room_id} · סה״כ חדרים למשפחה: {familyRoomCount}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ color: "#475569", mb: 0.5 }}>
            לבחור היקף ההסרה:
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1, flexDirection: "column", alignItems: "stretch" }}>
          <Button
            variant="outlined"
            onClick={handleRemoveSingle}
            sx={{
              textTransform: "none",
              borderColor: "#94a3b8",
              color: "#334155",
              justifyContent: "flex-start",
            }}
          >
            הסר מחדר זה בלבד
          </Button>
          <Button
            variant="outlined"
            onClick={handleRemoveAll}
            sx={{
              textTransform: "none",
              borderColor: "#dc2626",
              color: "#dc2626",
              justifyContent: "flex-start",
            }}
          >
            הסר מכל החדרים ({familyRoomCount})
          </Button>
          <Button
            onClick={() => setRemoveChoiceOpen(false)}
            sx={{ textTransform: "none", color: "#64748b", alignSelf: "flex-end" }}
          >
            ביטול
          </Button>
        </DialogActions>
      </Dialog>

      {/* Single-room remove confirm — replaces the previous window.confirm.
          Same shell as the multi-room dialog above: 14px Paper, RTL,
          PersonRemove icon + bottom-bordered title, info box, styled
          buttons with a destructive red confirm. */}
      <Dialog
        open={singleRemoveOpen}
        onClose={() => setSingleRemoveOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "14px", direction: "rtl" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            pb: 1,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <PersonRemoveIcon sx={{ fontSize: 20, color: "#dc2626" }} />
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#1e293b" }}>
            הסרת משפחה מהחדר
          </Typography>
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
                החדר: {booking.room_id}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" sx={{ color: "#475569" }}>
            {booking
              ? `להסיר את משפחת ${booking.family_name} מחדר ${booking.room_id}?`
              : ""}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setSingleRemoveOpen(false)}
            sx={{ textTransform: "none", color: "#64748b" }}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            onClick={handleSingleRemoveConfirm}
            sx={{
              textTransform: "none",
              backgroundColor: "#dc2626",
              "&:hover": { backgroundColor: "#b91c1c" },
            }}
          >
            הסר
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RoomDetailPanel;
