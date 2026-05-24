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

const AREA_CODES = ["050", "052", "053", "054", "058", "+44", "+1081"];

// Compact personal pane (Direction B): one pane, lightweight text group-labels
// (no bordered sub-cards), denser responsive grid. Flight toggles live in the
// נסיעה pane, not here.
function PersonalDetailsStep({ handleInputChange }) {
  const classes = useStyles();
  const form = useSelector((state) => state.userSlice.form);
  const inputRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) nextInput.focus();
    }
  };

  // Auto-format birth date as DD/MM/YYYY
  const handleBirthDateChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 8);
    let formatted = raw;
    if (raw.length > 4) {
      formatted = raw.slice(0, 2) + "/" + raw.slice(2, 4) + "/" + raw.slice(4);
    } else if (raw.length > 2) {
      formatted = raw.slice(0, 2) + "/" + raw.slice(2);
    }
    handleInputChange({ target: { name: "birth_date", value: formatted } });
  };

  const phoneMenuProps = {
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

  const textField = (name, label, refIndex, extra = {}) => (
    <div className={classes.fieldItem}>
      <InputLabel className={classes.inputLabelStyle}>{label}</InputLabel>
      <TextField
        name={name}
        value={form[name] || ""}
        className={classes.textField}
        onChange={handleInputChange}
        size="small"
        inputRef={(el) => (inputRefs.current[refIndex] = el)}
        onKeyDown={(e) => handleKeyDown(e, refIndex)}
        {...extra}
      />
    </div>
  );

  return (
    <div className={classes.compactSection}>
      {/* Names */}
      <Typography className={classes.groupLabel}>שמות</Typography>
      <div className={classes.compactGrid}>
        {textField("hebrew_first_name", "שם פרטי בעברית", 0)}
        {textField("hebrew_last_name", "שם משפחה בעברית", 1)}
        {textField("english_first_name", "שם פרטי באנגלית", 2)}
        {textField("english_last_name", "שם משפחה באנגלית", 3)}
      </div>

      {/* Personal */}
      <Typography className={classes.groupLabel}>פרטים אישיים</Typography>
      <div className={classes.compactGrid}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>תאריך לידה</InputLabel>
          <TextField
            name="birth_date"
            value={form.birth_date || ""}
            className={classes.textField}
            onChange={handleBirthDateChange}
            size="small"
            placeholder="DD/MM/YYYY"
            inputRef={(el) => (inputRefs.current[4] = el)}
            onKeyDown={(e) => handleKeyDown(e, 4)}
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>גיל</InputLabel>
          <TextField name="age" value={form.age || ""} className={classes.textField} disabled size="small" />
        </div>
        {textField("identity_id", "מספר זהות", 5)}
        {textField("email", "אימייל", 6)}
      </div>

      {/* Contact */}
      <Typography className={classes.groupLabel}>פרטי קשר</Typography>
      <div className={classes.compactGrid}>
        <div className={classes.compactItemFull}>
          <InputLabel className={classes.inputLabelStyle}>כתובת מלאה</InputLabel>
          <TextField
            name="address"
            value={form.address || ""}
            className={classes.textField}
            onChange={handleInputChange}
            size="small"
            inputRef={(el) => (inputRefs.current[7] = el)}
            onKeyDown={(e) => handleKeyDown(e, 7)}
          />
        </div>
        <div className={classes.compactItemFull}>
          <InputLabel className={classes.inputLabelStyle}>מספר טלפון</InputLabel>
          <div className={classes.phoneRow}>
            <TextField
              name="phone_b"
              value={form.phone_b || ""}
              className={classes.phoneField}
              onChange={handleInputChange}
              size="small"
              placeholder="1234567"
              inputRef={(el) => (inputRefs.current[8] = el)}
              onKeyDown={(e) => handleKeyDown(e, 8)}
            />
            <Select
              name="phone_a"
              value={form.phone_a || ""}
              onChange={handleInputChange}
              input={<OutlinedInput className={classes.areaCodeSelect} />}
              displayEmpty
              renderValue={(value) => value || "קידומת"}
              MenuProps={phoneMenuProps}
            >
              {AREA_CODES.map((code) => (
                <MenuItem key={code} value={code} className={classes.menuItem}>{code}</MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetailsStep;
