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

const STATUS_OPTIONS = [
  { value: "new_interest",       label: "ליד חדש" },
  { value: "no_answer",          label: "לא ענה" },
  { value: "follow_up",          label: "בטיפול" },
  { value: "meeting_scheduled",  label: "פגישה נקבעה" },
  { value: "interested",         label: "מעוניין" },
  { value: "registered",         label: "נרשם" },
  { value: "not_relevant",       label: "לא רלוונטי" },
];

const SOURCE_OPTIONS = [
  { value: "phone",     label: "טלפון" },
  { value: "referral",  label: "המלצה" },
  { value: "website",   label: "אתר" },
  { value: "social",    label: "רשתות חברתיות" },
  { value: "other",     label: "אחר" },
];

function LeadView({ form, isEdit, handleInputChange, handleSelectChange, submit, handleCloseClicked }) {
  const classes = useStyles();

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
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>גודל משפחה</InputLabel>
          <TextField
            name="family_size"
            type="number"
            className={classes.textField}
            value={form.family_size || ""}
            onChange={handleInputChange}
            size="small"
            inputProps={{ min: 1 }}
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
