import React, { useState, useEffect, useRef } from "react";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import ApiRooms from "../../../apis/roomsRequest";

const AssignFamilyDialog = ({
  open,
  roomIds,
  boardData,
  vacationId,
  token,
  onClose,
  onAssign,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const debounceRef = useRef(null);

  // Reset state whenever the dialog opens
  useEffect(() => {
    if (open) {
      setInputValue("");
      setSearchResults([]);
      setSelectedFamily(null);
    }
  }, [open]);

  // Debounced server-side search triggered by inputValue changes
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!inputValue || inputValue.trim().length < 1) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      if (!vacationId) return;
      setSearching(true);
      try {
        const res = await ApiRooms.searchFamilies(token, vacationId, inputValue.trim());
        setSearchResults(res.data || []);
      } catch (err) {
        console.error("Family search failed", err);
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [inputValue, token, vacationId]);

  // Count how many rooms a family currently has in room_taken (any date range)
  const getAssignedRoomCount = (familyId) =>
    boardData.bookings.filter((b) => b.family_id === familyId).length;

  // Parse families.number_of_rooms (varchar, may be "", "0", or non-numeric).
  // Returns a positive integer or null when the cap is unknown.
  const getReservedRoomCount = (option) => {
    const raw = option?.number_of_rooms;
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  // Locked only when the family has filled its reserved count.
  // If number_of_rooms is blank/0/unparseable, never lock.
  const isFamilyFull = (option) => {
    const reserved = getReservedRoomCount(option);
    if (reserved === null) return false;
    return getAssignedRoomCount(option.family_id) >= reserved;
  };

  const handleAssign = () => {
    if (!selectedFamily) return;
    onAssign(
      selectedFamily.family_id,
      roomIds,
      selectedFamily.start_date,
      selectedFamily.end_date
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth dir="rtl">
      <DialogTitle sx={{ fontWeight: 700, fontSize: 16, pb: 1 }}>
        שיבוץ חדרים למשפחה
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {/* Selected rooms */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "#475569" }}>
            חדרים נבחרים:
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
            {roomIds.map((id) => (
              <Chip key={id} label={`חדר ${id}`} size="small" color="primary" variant="outlined" />
            ))}
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/*
          MUI Autocomplete renders the dropdown via Popper (portal to document.body).
          This avoids any overflow/clipping issues inside the Dialog and prevents jumping.
        */}
        <Autocomplete
          options={searchResults}
          getOptionLabel={(option) => option.family_name || ""}
          // Disable built-in client-side filtering — server handles it
          filterOptions={(x) => x}
          isOptionEqualToValue={(option, value) => option.family_id === value.family_id}
          getOptionDisabled={(option) => isFamilyFull(option)}
          value={selectedFamily}
          onChange={(_, newValue) => setSelectedFamily(newValue)}
          inputValue={inputValue}
          onInputChange={(_, value, reason) => {
            // Only update when the user is actually typing, not when an option is selected
            if (reason === "input" || reason === "clear") {
              setInputValue(value);
              if (reason === "clear") setSelectedFamily(null);
            }
          }}
          loading={searching}
          loadingText="מחפש..."
          noOptionsText={
            inputValue.trim().length < 1 ? "הקלד שם לחיפוש" : "לא נמצאו משפחות"
          }
          // Render dropdown option with dates / "already assigned" label
          renderOption={(props, option) => {
            const { key, ...restProps } = props;
            const assigned = getAssignedRoomCount(option.family_id);
            const reserved = getReservedRoomCount(option);
            const disabled = isFamilyFull(option);
            // Chip is shown whenever we know the reservation count, even at
            // 0/Y — so the user sees the family's full target up-front (e.g.
            // a family reserving 2 rooms shows "0/2 חדרים" before any room
            // is assigned). Families with no number_of_rooms value still
            // show no chip.
            const showChip = reserved !== null;
            const chipColor = disabled
              ? { bg: "#fee2e2", border: "#fca5a5", text: "#991b1b" }   // red — full
              : { bg: "#fef3c7", border: "#fcd34d", text: "#92400e" };  // amber — partial
            return (
              <li key={key} {...restProps}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, width: "100%" }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, color: disabled ? "#dc2626" : undefined }}
                    >
                      {option.family_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: disabled ? "#dc2626" : "#64748b" }}
                    >
                      {disabled
                        ? "הושלם — לא נדרשים חדרים נוספים"
                        : `${option.start_date || ""} — ${option.end_date || ""}`}
                    </Typography>
                  </Box>
                  {showChip && (
                    <Chip
                      label={`${assigned}/${reserved} חדרים`}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: chipColor.bg,
                        color: chipColor.text,
                        border: `1px solid ${chipColor.border}`,
                      }}
                    />
                  )}
                </Box>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="חיפוש משפחה לפי שם"
              size="small"
              autoFocus
              InputProps={{
                ...(params.InputProps || {}),
                endAdornment: (
                  <>
                    {searching && <CircularProgress size={16} />}
                    {params.InputProps?.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />

        {/* Selected family summary card */}
        {selectedFamily && (
          <Box
            sx={{
              mt: 2,
              p: 1.5,
              backgroundColor: "#f0fdf4",
              border: "1px solid #86efac",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#065f46" }}>
              משפחה נבחרת: {selectedFamily.family_name}
            </Typography>
            <Typography variant="caption" sx={{ color: "#047857" }}>
              תאריכי שהייה: {selectedFamily.start_date} — {selectedFamily.end_date}
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none", color: "#64748b" }}>
          ביטול
        </Button>
        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={!selectedFamily}
          sx={{ textTransform: "none", backgroundColor: "#2563eb" }}
        >
          שייך
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignFamilyDialog;
