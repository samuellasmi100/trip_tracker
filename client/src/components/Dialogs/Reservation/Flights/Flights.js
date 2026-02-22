import React from "react";
import {
  Switch,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputLabel,
} from "@mui/material";
import { useStyles } from "../../Guest/GuestWizard.style";
import { useSelector } from "react-redux";

function Flights({ handleInputChange }) {
  const classes = useStyles();
  const form = useSelector((state) => state.userSlice.form);

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
      </div>

      {/* Flight direction radio group */}
      {Boolean(form.flights) && (
        <div style={{ marginTop: "16px" }}>
          <InputLabel
            className={classes.inputLabelStyle}
            style={{ marginBottom: "8px" }}
          >
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
    </>
  );
}

export default Flights;
