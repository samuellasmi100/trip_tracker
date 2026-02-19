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

  return (
    <div className={classes.sectionCard}>
      <Typography className={classes.sectionTitle}>פרטים אישיים</Typography>

      <div className={classes.fieldGroup}>
        {/* Hebrew first name */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>שם פרטי בעברית</InputLabel>
          <TextField
            name="hebrew_first_name"
            value={form.hebrew_first_name || ""}
            className={classes.textField}
            onChange={handleInputChange}
            size="small"
            inputRef={(el) => (inputRefs.current[0] = el)}
            onKeyDown={(e) => handleKeyDown(e, 0)}
          />
        </div>

        {/* Hebrew last name */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>שם משפחה בעברית</InputLabel>
          <TextField
            name="hebrew_last_name"
            value={form.hebrew_last_name || ""}
            className={classes.textField}
            onChange={handleInputChange}
            size="small"
            inputRef={(el) => (inputRefs.current[1] = el)}
            onKeyDown={(e) => handleKeyDown(e, 1)}
          />
        </div>

        {/* English first name */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>שם פרטי באנגלית</InputLabel>
          <TextField
            name="english_first_name"
            value={form.english_first_name || ""}
            className={classes.textField}
            onChange={handleInputChange}
            size="small"
            inputRef={(el) => (inputRefs.current[2] = el)}
            onKeyDown={(e) => handleKeyDown(e, 2)}
          />
        </div>

        {/* English last name */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>שם משפחה באנגלית</InputLabel>
          <TextField
            name="english_last_name"
            value={form.english_last_name || ""}
            className={classes.textField}
            onChange={handleInputChange}
            size="small"
            inputRef={(el) => (inputRefs.current[3] = el)}
            onKeyDown={(e) => handleKeyDown(e, 3)}
          />
        </div>

        {/* Birth date */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>תאריך לידה</InputLabel>
          <TextField
            name="birth_date"
            type="date"
            value={form.birth_date || ""}
            className={classes.dateField}
            onChange={handleInputChange}
            size="small"
            inputRef={(el) => (inputRefs.current[4] = el)}
            onKeyDown={(e) => handleKeyDown(e, 4)}
          />
        </div>

        {/* Age (auto-calculated, disabled) */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>גיל</InputLabel>
          <TextField
            name="age"
            value={form.age || ""}
            className={classes.textField}
            disabled
            size="small"
          />
        </div>

        {/* Identity ID */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>מספר זהות</InputLabel>
          <TextField
            name="identity_id"
            value={form.identity_id || ""}
            className={classes.textField}
            onChange={handleInputChange}
            size="small"
            inputRef={(el) => (inputRefs.current[5] = el)}
            onKeyDown={(e) => handleKeyDown(e, 5)}
          />
        </div>

        {/* Email */}
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>אימייל</InputLabel>
          <TextField
            name="email"
            value={form.email || ""}
            className={classes.textField}
            onChange={handleInputChange}
            size="small"
            inputRef={(el) => (inputRefs.current[6] = el)}
            onKeyDown={(e) => handleKeyDown(e, 6)}
          />
        </div>

        {/* Address */}
        <div className={classes.fieldItem}>
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

        {/* Phone */}
        <div className={classes.fieldItem}>
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
              {AREA_CODES.map((code) => (
                <MenuItem key={code} value={code} className={classes.menuItem}>
                  {code}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalDetailsStep;
