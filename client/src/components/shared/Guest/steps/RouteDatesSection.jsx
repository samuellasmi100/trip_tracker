import React, { useRef } from "react";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useStyles } from "../GuestWizard.style";
import { useSelector } from "react-redux";
import { formatDateInput, isoToDisplay } from "../../../../utils/helpers/formatDate";

// Dropdown label only: append the route's date range so the secretary can pick a
// week by its actual dates. The option VALUE stays the route name (the assignment
// key) — only the displayed text changes. Routes store ISO; isoToDisplay renders
// DD/MM/YYYY. חריגים (and any dateless row) shows the name with no range.
const routeOptionLabel = (route) => {
  const start = isoToDisplay(route.start_date);
  const end = isoToDisplay(route.end_date);
  return start && end ? `${route.name} (${start}–${end})` : route.name;
};

// Route & Dates block (route selector + arrival/departure dates) shared by the
// Add trip step (TripOptionsStep) and the Edit guest trip tab (GuestEditor).
// Bound to userSlice.form via the parent's handleInputChange so week_chosen /
// arrival_date / departure_date render, save and dirty-track identically in
// both flows. The addFamily-only fields stay here so the add-family dialog keeps
// the same markup; they self-hide for the per-guest add/edit flows.
function RouteDatesSection({ handleInputChange }) {
  const classes = useStyles();
  const form = useSelector((state) => state.userSlice.form);
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates);

  const isAddFamily = dialogType === "addFamily";
  const isAddGuest = dialogType === "addParent" || dialogType === "addChild";
  const hasPrefilledData = isAddGuest && (form.week_chosen || form.arrival_date);

  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      let next = index + 1;
      while (next < inputRefs.current.length) {
        if (inputRefs.current[next]) { inputRefs.current[next].focus(); break; }
        next++;
      }
    }
  };

  const handleDateChange = (e) => {
    handleInputChange({
      target: { name: e.target.name, value: formatDateInput(e.target.value) },
    });
  };

  const menuProps = {
    style: { zIndex: 1700 },
    PaperProps: {
      sx: {
        bgcolor: "#ffffff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      },
    },
  };

  return (
    <div className={classes.sectionCard}>
      <Typography className={classes.sectionTitle}>
        {isAddFamily ? "פרטי הזמנה" : "פרטי נסיעה"}
      </Typography>

      {hasPrefilledData && (
        <div style={{
          backgroundColor: "#f0fdfa",
          border: "1px solid #99f6e4",
          borderRadius: "8px",
          padding: "10px 14px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}>
          <span style={{ fontSize: "14px" }}>&#8505;</span>
          <Typography style={{ fontSize: "12px", color: "#0f766e", fontWeight: 500 }}>
            הנתונים הועתקו מפרטי המשפחה — ניתן לשנות לפי הצורך
          </Typography>
        </div>
      )}

      <div className={classes.fieldGroup}>
        {/* Route selector */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>בחר מסלול</InputLabel>
          <Select
            name="week_chosen"
            value={form.week_chosen || ""}
            onChange={handleInputChange}
            input={<OutlinedInput className={classes.selectField} />}
            displayEmpty
            renderValue={(value) => value || "בחר..."}
            MenuProps={menuProps}
          >
            {vacationsDates?.map((type) => (
              <MenuItem key={type.name} value={type.name} className={classes.menuItem}>
                {routeOptionLabel(type)}
              </MenuItem>
            ))}
          </Select>
        </div>

        {/* Number of guests (addFamily only) */}
        {isAddFamily && (
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>כמות נופשים</InputLabel>
            <TextField
              name="number_of_guests"
              value={form.number_of_guests || ""}
              className={classes.textField}
              onChange={handleInputChange}
              size="small"
              inputRef={(el) => (inputRefs.current[0] = el)}
              onKeyDown={(e) => handleKeyDown(e, 0)}
            />
          </div>
        )}

        {/* Arrival date */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>תאריך הגעה</InputLabel>
          <TextField
            name="arrival_date"
            value={isoToDisplay(form.arrival_date) || ""}
            className={classes.textField}
            onChange={handleDateChange}
            size="small"
            placeholder="DD/MM/YYYY"
            disabled={form.week_chosen !== "חריגים"}
            inputRef={(el) => (inputRefs.current[1] = el)}
            onKeyDown={(e) => handleKeyDown(e, 1)}
          />
        </div>

        {/* Departure date */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>תאריך עזיבה</InputLabel>
          <TextField
            name="departure_date"
            value={isoToDisplay(form.departure_date) || ""}
            className={classes.textField}
            onChange={handleDateChange}
            size="small"
            placeholder="DD/MM/YYYY"
            disabled={form.week_chosen !== "חריגים"}
            inputRef={(el) => (inputRefs.current[2] = el)}
            onKeyDown={(e) => handleKeyDown(e, 2)}
          />
        </div>

        {/* Deal amount (addFamily only) */}
        {isAddFamily && (
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>סכום עסקה</InputLabel>
            <TextField
              name="total_amount"
              value={form.total_amount || ""}
              className={classes.textField}
              onChange={handleInputChange}
              size="small"
              inputRef={(el) => (inputRefs.current[3] = el)}
              onKeyDown={(e) => handleKeyDown(e, 3)}
            />
          </div>
        )}

        {/* Number of rooms (addFamily only) */}
        {isAddFamily && (
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>כמות חדרים</InputLabel>
            <TextField
              name="number_of_rooms"
              value={form.number_of_rooms || ""}
              className={classes.textField}
              onChange={handleInputChange}
              size="small"
              inputRef={(el) => (inputRefs.current[4] = el)}
              onKeyDown={(e) => handleKeyDown(e, 4)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RouteDatesSection;
