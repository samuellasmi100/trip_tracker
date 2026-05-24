import React from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { useStyles } from "./Lead.style";
import { toLocalYMD } from "../../../utils/helpers/formatDate";

const STATUS_OPTIONS = [
  { value: "new_interest",  label: "חדש" },
  { value: "follow_up",     label: "בתהליך" },
  { value: "registered",    label: "נסגר" },
  { value: "not_relevant",  label: "לא רלוונטי" },
];

const SOURCE_OPTIONS = [
  { value: "phone",     label: "טלפון" },
  { value: "referral",  label: "המלצה" },
  { value: "website",   label: "אתר" },
  { value: "social",    label: "רשתות חברתיות" },
  { value: "other",     label: "אחר" },
];

// MySQL DATE returns either a Date object or 'YYYY-MM-DDTHH:mm:ss.000Z'.
// The native <input type="date"> needs a plain 'YYYY-MM-DD' string.
// Local YYYY-MM-DD so a UTC-serialized DATE doesn't display a day early.
const toDateInput = toLocalYMD;

// Group the integer part with thousands separators for readable money entry,
// preserving any decimal the user is mid-typing (e.g. "1000." / "1000.5").
const formatMoneyInput = (v) => {
  if (v === null || v === undefined || v === "") return "";
  const [intPart, ...rest] = String(v).split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return rest.length ? `${grouped}.${rest.join("")}` : grouped;
};

function LeadView({ form, isEdit, handleInputChange, handleSelectChange, submit, handleCloseClicked }) {
  const classes = useStyles();

  // Strip separators (and any non-numeric) before storing, so the DB gets a
  // clean number while the field shows grouped digits.
  const handleMoneyChange = (e) => {
    const clean = e.target.value.replace(/[^\d.]/g, "");
    handleInputChange({ target: { name: e.target.name, value: clean } });
  };

  return (
    <Grid className={classes.wrapper}>
      <Typography className={classes.title}>
        {isEdit ? "עדכון ליד" : "הוספת ליד חדש"}
      </Typography>

      <div className={classes.fieldGroup}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>שם מלא *</InputLabel>
          <TextField
            name="full_name"
            className={classes.textField}
            value={form.full_name || ""}
            onChange={handleInputChange}
            size="small"
            placeholder="שם המשפחה"
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>טלפון</InputLabel>
          <TextField
            name="phone"
            className={classes.textField}
            value={form.phone || ""}
            onChange={handleInputChange}
            size="small"
            placeholder="050-0000000"
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>אימייל</InputLabel>
          <TextField
            name="email"
            className={classes.textField}
            value={form.email || ""}
            onChange={handleInputChange}
            size="small"
            placeholder="example@mail.com"
          />
        </div>
      </div>

      <div className={classes.fieldGroup}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>סטטוס</InputLabel>
          <FormControl size="small" className={classes.selectField}>
            <Select
              name="status"
              value={form.status || "new_interest"}
              onChange={handleSelectChange}
              style={{ fontSize: 13, borderRadius: "8px" }}
            >
              {STATUS_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} style={{ fontSize: 13 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>מקור</InputLabel>
          <FormControl size="small" className={classes.selectField}>
            <Select
              name="source"
              value={form.source || "phone"}
              onChange={handleSelectChange}
              style={{ fontSize: 13, borderRadius: "8px" }}
            >
              {SOURCE_OPTIONS.map((opt) => (
                <MenuItem key={opt.value} value={opt.value} style={{ fontSize: 13 }}>
                  {opt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <div className={classes.fieldGroup}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>תאריך פולואפ</InputLabel>
          <TextField
            name="followup_date"
            type="date"
            className={classes.textField}
            value={toDateInput(form.followup_date)}
            onChange={handleInputChange}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
        </div>
        {isEdit && (
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>תאריך פתיחת ליד</InputLabel>
            <TextField
              name="last_contact_date"
              type="date"
              className={classes.textField}
              value={toDateInput(form.last_contact_date)}
              size="small"
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: true }}
            />
          </div>
        )}
      </div>

      <div className={classes.fieldGroup}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>מחיר שקיבל (₪)</InputLabel>
          <TextField
            name="price"
            type="text"
            className={classes.textField}
            value={formatMoneyInput(form.price)}
            onChange={handleMoneyChange}
            size="small"
            inputProps={{ inputMode: "decimal" }}
            placeholder="0"
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>כמות הנחה (₪)</InputLabel>
          <TextField
            name="discount"
            type="text"
            className={classes.textField}
            value={formatMoneyInput(form.discount)}
            onChange={handleMoneyChange}
            size="small"
            inputProps={{ inputMode: "decimal" }}
            placeholder="0"
          />
        </div>
      </div>

      <div className={classes.fieldGroup}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>השתלמות</InputLabel>
          <TextField
            name="training"
            className={classes.textField}
            value={form.training || ""}
            onChange={handleInputChange}
            size="small"
            placeholder="כן / לא / שם הקורס"
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>הרכב</InputLabel>
          <TextField
            name="composition"
            className={classes.textField}
            value={form.composition || ""}
            onChange={handleInputChange}
            size="small"
            placeholder='לדוגמה "זוג+4"'
          />
        </div>
      </div>

      <div className={classes.fieldGroupFull}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>הופנה על ידי</InputLabel>
          <TextField
            name="referred_by"
            className={classes.textField}
            value={form.referred_by || ""}
            onChange={handleInputChange}
            size="small"
            placeholder="שם הממליץ"
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>הערות</InputLabel>
          <TextField
            name="notes"
            className={classes.notesField}
            value={form.notes || ""}
            onChange={handleInputChange}
            multiline
            rows={3}
            size="small"
            placeholder="הערות נוספות..."
          />
        </div>
      </div>

      <div className={classes.actions}>
        <Button onClick={submit} className={classes.submitButton}>
          {isEdit ? "עדכן" : "הוסף"}
        </Button>
        <Button onClick={handleCloseClicked} className={classes.cancelButton}>
          ביטול
        </Button>
      </div>
    </Grid>
  );
}

export default LeadView;
