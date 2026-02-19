import React from "react";
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

function TripOptionsStep({ handleInputChange }) {
  const classes = useStyles();
  const form = useSelector((state) => state.userSlice.form);
  const dialogType = useSelector((state) => state.dialogSlice.type);
  const vacationsDates = useSelector((state) => state.vacationSlice.vacationsDates);

  const isParentType = dialogType === "editParent" || dialogType === "addFamily";
  const isChildType = dialogType === "editChild" || dialogType === "addChild";

  const handleFlightDirectionChange = (e) => {
    handleInputChange({
      target: {
        name: "flights_direction",
        value: e.target.value,
        checked: true,
      },
    });
  };

  return (
    <>
      {/* Route & Dates Section */}
      <div className={classes.sectionCard}>
        <Typography className={classes.sectionTitle}>פרטי הזמנה</Typography>

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
              MenuProps={{
                PaperProps: {
                  sx: {
                    bgcolor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    border: "1px solid #e2e8f0",
                  },
                },
              }}
            >
              {vacationsDates?.map((type) => (
                <MenuItem key={type.name} value={type.name} className={classes.menuItem}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </div>

          {/* Number of guests (parent only) */}
          {isParentType && (
            <div className={classes.fieldItem}>
              <InputLabel className={classes.inputLabelStyle}>כמות נופשים</InputLabel>
              <TextField
                name="number_of_guests"
                value={form.number_of_guests || ""}
                className={classes.textField}
                onChange={handleInputChange}
                size="small"
              />
            </div>
          )}

          {/* Number of rooms (parent only) */}
          {isParentType && (
            <div className={classes.fieldItem}>
              <InputLabel className={classes.inputLabelStyle}>כמות חדרים</InputLabel>
              <TextField
                name="number_of_rooms"
                value={form.number_of_rooms || ""}
                className={classes.textField}
                onChange={handleInputChange}
                size="small"
              />
            </div>
          )}

          {/* Deal amount (non-child) */}
          {!isChildType && (
            <div className={classes.fieldItem}>
              <InputLabel className={classes.inputLabelStyle}>סכום עסקה</InputLabel>
              <TextField
                name="total_amount"
                value={form.total_amount || ""}
                className={classes.textField}
                onChange={handleInputChange}
                size="small"
              />
            </div>
          )}

          {/* Number of payments (non-child) */}
          {!isChildType && (
            <div className={classes.fieldItem}>
              <InputLabel className={classes.inputLabelStyle}>מספר תשלומים</InputLabel>
              <TextField
                name="number_of_payments"
                value={form.number_of_payments || ""}
                className={classes.textField}
                onChange={handleInputChange}
                size="small"
              />
            </div>
          )}

          {/* Arrival date */}
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>תאריך הגעה</InputLabel>
            <TextField
              type="date"
              name="arrival_date"
              value={form.arrival_date || ""}
              className={classes.dateField}
              onChange={handleInputChange}
              size="small"
            />
          </div>

          {/* Departure date */}
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>תאריך עזיבה</InputLabel>
            <TextField
              type="date"
              name="departure_date"
              value={form.departure_date || ""}
              className={classes.dateField}
              onChange={handleInputChange}
              size="small"
            />
          </div>
        </div>
      </div>

      {/* Flights Section */}
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

          {dialogType !== "addFamily" && (
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
          )}
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
    </>
  );
}

export default TripOptionsStep;
