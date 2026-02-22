import React, { useRef } from "react";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useStyles } from "../GuestWizard.style";
import { useSelector } from "react-redux";
import { formatDateInput, isoToDisplay } from "../../../../utils/HelperFunction/formatDate";

function TripOptionsStep({ handleInputChange }) {
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

  const handleFlightDirectionChange = (e) => {
    handleInputChange({
      target: {
        name: "flights_direction",
        value: e.target.value,
        checked: true,
      },
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
    <>
      {/* Route & Dates Section */}
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
                  {type.name}
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

      {/* Flights Section — per-guest only, not for addFamily */}
      {!isAddFamily && (
        <div className={classes.sectionCard}>
          <Typography className={classes.sectionTitle}>טיסות ואפשרויות</Typography>

          <div className={classes.switchRow}>
            <FormControlLabel
              control={
                <Switch
                  name="flights"
                  className={classes.switchControl}
                  onChange={handleInputChange}
                  checked={Boolean(form.flights)}
                  size="small"
                />
              }
              label={<span className={classes.switchLabel}>כולל טיסות</span>}
            />

            {Boolean(form.flights) && (
              <FormControlLabel
                control={
                  <Switch
                    name="flying_with_us"
                    className={classes.switchControl}
                    onChange={handleInputChange}
                    checked={Boolean(form.flying_with_us)}
                    size="small"
                  />
                }
                label={<span className={classes.switchLabel}>טסים איתנו</span>}
              />
            )}

            <FormControlLabel
              control={
                <Switch
                  name="is_in_group"
                  className={classes.switchControl}
                  onChange={handleInputChange}
                  checked={Boolean(form.is_in_group)}
                  size="small"
                />
              }
              label={<span className={classes.switchLabel}>חלק מקבוצה?</span>}
            />
          </div>

          {/* Flight direction radio group */}
          {Boolean(form.flights) && (
            <div style={{ marginTop: "16px" }}>
              <InputLabel className={classes.inputLabelStyle} style={{ marginBottom: "8px" }}>
                כיוון טיסה
              </InputLabel>
              <RadioGroup
                name="flights_direction"
                value={form.flights_direction || ""}
                onChange={handleFlightDirectionChange}
                className={classes.radioGroup}
              >
                <FormControlLabel
                  value="round_trip"
                  control={<Radio size="small" />}
                  label="הלוך ושוב"
                  className={classes.radioLabel}
                />
                <FormControlLabel
                  value="one_way_outbound"
                  control={<Radio size="small" />}
                  label="הלוך בלבד"
                  className={classes.radioLabel}
                />
                <FormControlLabel
                  value="one_way_return"
                  control={<Radio size="small" />}
                  label="חזור בלבד"
                  className={classes.radioLabel}
                />
              </RadioGroup>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default TripOptionsStep;
