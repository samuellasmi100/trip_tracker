import React, { useRef } from "react";
import {
  TextField,
  InputLabel,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
import { useStyles } from "../GuestWizard.style";
import { useSelector } from "react-redux";
import { legacyPartsToE164 } from "../../../../utils/helpers/phoneFormat";

// Compact personal pane (Direction B): one pane, lightweight text group-labels
// (no bordered sub-cards), denser responsive grid. Flight toggles live in the
// נסיעה pane, not here.
function PersonalDetailsStep({ handleInputChange }) {
  const classes = useStyles();
  const form = useSelector((state) => state.userSlice.form);
  const guests = useSelector((state) => state.userSlice.guests);
  const inputRefs = useRef([]);

  // Coerce the truthy variants the API + form sometimes use (1, "1", true).
  const isMain = form.is_main_user === 1 || form.is_main_user === "1" || form.is_main_user === true;

  // When the toggle is being flipped ON, find any OTHER guest in the family
  // that's currently marked as main — used to render a soft warning that the
  // save will demote them. Skips the warning for the guest being edited (so
  // an unchanged main doesn't trigger its own demotion notice).
  const existingMain = (guests || []).find(
    (g) => (g.is_main_user === 1 || g.is_main_user === true) && g.user_id !== form.user_id
  );

  const handleMainToggle = (e) => {
    handleInputChange({
      target: { name: "is_main_user", value: e.target.checked, checked: e.target.checked },
    });
  };

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

  // Unified phone input (react-phone-input-2). The widget reports the number as
  // digits WITHOUT a leading "+", so we store E.164 by prepending it. For guests
  // not yet backfilled, prefill from the legacy phone_a/phone_b pair.
  const phoneValue = (form.phone || legacyPartsToE164(form.phone_a, form.phone_b) || "").replace(/\D/g, "");

  const handlePhoneChange = (value) => {
    handleInputChange({ target: { name: "phone", value: value ? `+${value}` : "" } });
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

  // Resolve the existing main's display name for the demotion caption, with
  // sensible fallbacks. Hebrew first, English next, identity_id last.
  const existingMainName = existingMain
    ? (
        [existingMain.hebrew_first_name, existingMain.hebrew_last_name].filter(Boolean).join(" ").trim() ||
        [existingMain.english_first_name, existingMain.english_last_name].filter(Boolean).join(" ").trim() ||
        existingMain.identity_id ||
        "ראש המשפחה הנוכחי"
      )
    : null;

  return (
    <div className={classes.compactSection}>
      {/* Head-of-family toggle — first so it's seen before names are filled in. */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "10px 14px",
          marginBottom: "16px",
          background: isMain ? "#ecfeff" : "#f8fafc",
          border: `1px solid ${isMain ? "#a5f3fc" : "#e2e8f0"}`,
          borderRadius: "10px",
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={isMain}
              onChange={handleMainToggle}
              size="small"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#0d9488" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#0d9488" },
              }}
            />
          }
          label={
            <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px", fontWeight: 600, color: "#0f172a" }}>
              <StarOutlineIcon style={{ fontSize: "18px", color: isMain ? "#0d9488" : "#64748b" }} />
              ראש משפחה
            </span>
          }
          sx={{ marginLeft: 0, marginRight: 0 }}
        />
        <span style={{ fontSize: "11px", color: "#64748b", textAlign: "left", lineHeight: 1.5 }}>
          איש הקשר עבור קישור לטופס רישום ואימות SMS
        </span>
      </div>
      {isMain && existingMainName && (
        <Typography style={{ fontSize: "12px", color: "#b45309", marginTop: "-10px", marginBottom: "14px", padding: "0 4px" }}>
          ⚠ פעולה זו תסיר את "ראש משפחה" מ-{existingMainName}.
        </Typography>
      )}

      {/* Names — Hebrew row, then English row */}
      <Typography className={classes.groupLabel}>שמות</Typography>
      <div className={classes.compactGrid}>
        {textField("hebrew_first_name", "שם פרטי בעברית", 0)}
        {textField("hebrew_last_name", "שם משפחה בעברית", 1)}
        {textField("english_first_name", "שם פרטי באנגלית", 2)}
        {textField("english_last_name", "שם משפחה באנגלית", 3)}
      </div>

      {/* Contact — email + address, then phone */}
      <Typography className={classes.groupLabel}>פרטי קשר</Typography>
      <div className={classes.compactGrid}>
        {textField("email", "אימייל", 4)}
        {textField("address", "כתובת מלאה", 5)}
        <div className={classes.compactItemFull}>
          <InputLabel className={classes.inputLabelStyle}>מספר טלפון</InputLabel>
          {/* dir=ltr: phone numbers + the country/dial dropdown read LTR even
              inside the RTL form. react-phone-input-2 stores full E.164. */}
          <div dir="ltr" style={{ direction: "ltr" }}>
            <PhoneInput
              country={"il"}
              preferredCountries={["il", "us", "gb", "fr"]}
              enableSearch
              value={phoneValue}
              onChange={handlePhoneChange}
              inputProps={{ name: "phone", onKeyDown: (e) => handleKeyDown(e, 6) }}
              inputStyle={{ width: "100%", height: "40px" }}
              specialLabel=""
            />
          </div>
        </div>
      </div>

      {/* Personal — birth date + age, then ID */}
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
            inputRef={(el) => (inputRefs.current[7] = el)}
            onKeyDown={(e) => handleKeyDown(e, 7)}
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>גיל</InputLabel>
          <TextField name="age" value={form.age || ""} className={classes.textField} disabled size="small" />
        </div>
        {textField("identity_id", "מספר זהות", 8)}
      </div>
    </div>
  );
}

export default PersonalDetailsStep;
