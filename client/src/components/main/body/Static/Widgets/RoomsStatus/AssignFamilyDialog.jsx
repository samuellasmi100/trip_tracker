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
import ApiRooms from "../../../../../../apis/roomsRequest";

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

  const isFamilyAlreadyInRoom = (familyId) =>
    roomIds.some((roomId) =>
      boardData.bookings.some((b) => b.room_id === roomId && b.family_id === familyId)
    );

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
          getOptionDisabled={(option) => isFamilyAlreadyInRoom(option.family_id)}
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
            const disabled = isFamilyAlreadyInRoom(option.family_id);
            return (
              <li key={key} {...restProps}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {option.family_name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: disabled ? "#dc2626" : "#64748b" }}
                  >
                    {disabled
                      ? "כבר משויך לחדר זה"
                      : `${option.start_date || ""} — ${option.end_date || ""}`}
                  </Typography>
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
                ...params.InputProps,
                endAdornment: (
                  <>
                    {searching && <CircularProgress size={16} />}
                    {params.InputProps.endAdornment}
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
