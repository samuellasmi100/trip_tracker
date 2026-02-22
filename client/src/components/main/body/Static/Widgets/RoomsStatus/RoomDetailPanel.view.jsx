import React from "react";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  IconButton,
  List,
  ListItem,
  Tooltip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PersonIcon from "@mui/icons-material/Person";
import BedIcon from "@mui/icons-material/Bed";

const RoomDetailPanelView = ({
  booking,
  room,
  allFamilyMembers,
  isChecked,
  onToggle,
  hasPendingChanges,
  onSave,
  saving,
  onMoveRoom,
  onClose,
  familyColor,
  capacity,
  assignedCount,
}) => {
  const capacityWarning = assignedCount >= capacity && capacity > 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <Box
        sx={{
          backgroundColor: familyColor.bg,
          borderBottom: `2px solid ${familyColor.border}`,
          p: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: familyColor.text, fontSize: 15 }}
          >
            <BedIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
            חדר {room.rooms_id}
            {room.floor ? ` · קומה ${room.floor}` : ""}
            {room.type ? ` · ${room.type}` : ""}
          </Typography>
          <Typography variant="body2" sx={{ color: familyColor.text, opacity: 0.8, mt: 0.3 }}>
            קיבולת: {room.base_occupancy} בסיסי
            {parseInt(room.max_occupancy) > 0 ? ` + ${room.max_occupancy} נוסף = ${capacity}` : ""}
          </Typography>
        </Box>
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* ── Family info ────────────────────────────────────── */}
      <Box sx={{ px: 2, py: 1.5, backgroundColor: "#fafafa", borderBottom: "1px solid #e2e8f0" }}>
        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1e293b" }}>
          <PersonIcon sx={{ fontSize: 15, mr: 0.5, verticalAlign: "middle" }} />
          משפחת {booking.family_name}
        </Typography>
        <Typography variant="caption" sx={{ color: "#64748b" }}>
          {booking.start_date} — {booking.end_date}
        </Typography>
      </Box>

      {/* ── Guest list ─────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflowY: "auto", px: 1, pt: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 1, mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569" }}>
            אורחים בחדר זה
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: capacityWarning ? "#dc2626" : "#64748b", fontWeight: capacityWarning ? 700 : 400 }}
          >
            {assignedCount}/{capacity} משובצים
          </Typography>
        </Box>

        {allFamilyMembers.length === 0 ? (
          <Typography variant="caption" sx={{ color: "#94a3b8", px: 1 }}>
            לא נמצאו אורחים
          </Typography>
        ) : (
          <List dense disablePadding>
            {allFamilyMembers.map((guest) => {
              const checked = isChecked(guest.user_id);
              const wouldExceed = !checked && assignedCount >= capacity && capacity > 0;
              return (
                <ListItem key={guest.user_id} disablePadding sx={{ py: 0.25, px: 0.5 }}>
                  <Tooltip
                    title={wouldExceed ? "חדר מלא — חרוג מהקיבולת" : ""}
                    placement="right"
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={checked}
                          onChange={() => onToggle(guest.user_id)}
                          sx={{ py: 0.25 }}
                          disabled={saving}
                        />
                      }
                      label={
                        <Box>
                          <Typography variant="body2" sx={{ fontSize: 13, lineHeight: 1.3 }}>
                            {guest.hebrew_first_name} {guest.hebrew_last_name}
                          </Typography>
                          {guest.is_main_user ? (
                            <Typography variant="caption" sx={{ color: "#94a3b8", fontSize: 10 }}>
                              ראשי
                            </Typography>
                          ) : null}
                        </Box>
                      }
                      sx={{ ml: 0, width: "100%" }}
                    />
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>

      {/* ── Actions ────────────────────────────────────────── */}
      <Divider />
      <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
        {hasPendingChanges && (
          <Button
            variant="contained"
            size="small"
            onClick={onSave}
            disabled={saving}
            fullWidth
            sx={{ backgroundColor: "#2563eb", textTransform: "none", fontWeight: 700 }}
          >
            {saving ? <CircularProgress size={16} color="inherit" /> : "שמור שיבוצים"}
          </Button>
        )}
        <Button
          variant="outlined"
          size="small"
          startIcon={<SwapHorizIcon />}
          onClick={onMoveRoom}
          fullWidth
          sx={{ textTransform: "none", borderColor: "#94a3b8", color: "#334155" }}
        >
          העבר לחדר אחר
        </Button>
      </Box>
    </Box>
  );
};

export default RoomDetailPanelView;
