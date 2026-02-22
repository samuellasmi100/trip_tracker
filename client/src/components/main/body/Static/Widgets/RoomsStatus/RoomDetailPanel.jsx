import React, { useState, useEffect } from "react";
import { Drawer } from "@mui/material";
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
}) => {
  // Local pending checkbox state — userId → true/false (overrides DB state until saved)
  const [pendingChanges, setPendingChanges] = useState({});
  const [saving, setSaving] = useState(false);

  // Reset pending changes whenever the panel opens for a new room/booking
  useEffect(() => {
    if (open) setPendingChanges({});
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

  const capacity = room
    ? parseInt(room.base_occupancy || 0) + parseInt(room.max_occupancy || 0)
    : 0;
  const assignedCount = assignedToRoom.length;
  const familyColor = booking
    ? (familyColorMap[booking.family_id] || { bg: "#f1f5f9", text: "#334155", border: "#94a3b8" })
    : { bg: "#f1f5f9", text: "#334155", border: "#94a3b8" };

  return (
    // Drawer is always mounted so open/close animation works;
    // content is only rendered when booking and room are present.
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
          isChecked={isChecked}
          onToggle={handleToggle}
          hasPendingChanges={hasPendingChanges}
          onSave={handleSave}
          saving={saving}
          onMoveRoom={() => onMoveRoom(booking)}
          onClose={onClose}
          familyColor={familyColor}
          capacity={capacity}
          assignedCount={assignedCount}
        />
      )}
    </Drawer>
  );
};

export default RoomDetailPanel;
