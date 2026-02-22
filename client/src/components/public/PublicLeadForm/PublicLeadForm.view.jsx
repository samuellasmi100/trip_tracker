import React from "react";
import { Typography, TextField, Button, InputLabel } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useStyles } from "./PublicLeadForm.style";

function PublicLeadFormView({ form, loading, submitted, handleChange, handleSubmit }) {
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <div className={classes.logoArea}>
          <Typography className={classes.brandName}>Avimor Tourism</Typography>
          <Typography className={classes.brandSub}>אביאל מור טיורים</Typography>
          <div className={classes.divider} />
        </div>

        {submitted ? (
          <div className={classes.successCard}>
            <CheckCircleOutlineIcon className={classes.successIcon} />
            <Typography className={classes.successTitle}>תודה רבה!</Typography>
            <Typography className={classes.successText}>
              פנייתכם התקבלה בהצלחה.
              <br />
              נחזור אליכם בהקדם.
            </Typography>
          </div>
        ) : (
          <>
            <Typography className={classes.title}>הצטרפו לחופשה שלנו</Typography>
            <Typography className={classes.subtitle}>
              מלאו את הפרטים ונחזור אליכם בקרוב עם כל המידע
            </Typography>

            <div className={classes.fieldGroup}>
              <div className={classes.fieldItem}>
                <InputLabel className={classes.label}>
                  שם מלא <span className={classes.required}>*</span>
                </InputLabel>
                <TextField
                  name="full_name"
                  className={classes.textField}
                  value={form.full_name}
                  onChange={handleChange}
                  size="small"
                  placeholder="ישראל ישראלי"
                  inputProps={{ dir: "rtl" }}
                />
              </div>
              <div className={classes.fieldItem}>
                <InputLabel className={classes.label}>טלפון</InputLabel>
                <TextField
                  name="phone"
                  className={classes.textField}
                  value={form.phone}
                  onChange={handleChange}
                  size="small"
                  placeholder="050-0000000"
                  inputProps={{ dir: "ltr" }}
                />
              </div>
            </div>

            <div className={classes.fieldGroup}>
              <div className={classes.fieldItem}>
                <InputLabel className={classes.label}>אימייל</InputLabel>
                <TextField
                  name="email"
                  className={classes.textField}
                  value={form.email}
                  onChange={handleChange}
                  size="small"
                  placeholder="mail@example.com"
                  inputProps={{ dir: "ltr" }}
                />
              </div>
              <div className={classes.fieldItem}>
                <InputLabel className={classes.label}>מספר נפשות</InputLabel>
                <TextField
                  name="family_size"
                  type="number"
                  className={classes.textField}
                  value={form.family_size}
                  onChange={handleChange}
                  size="small"
                  inputProps={{ min: 1, dir: "ltr" }}
                />
              </div>
            </div>

            <div className={classes.fieldGroupFull}>
              <div className={classes.fieldItem}>
                <InputLabel className={classes.label}>הערות / בקשות מיוחדות</InputLabel>
                <TextField
                  name="notes"
                  className={classes.textField}
                  value={form.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  size="small"
                  placeholder="ספרו לנו על עצמכם..."
                  inputProps={{ dir: "rtl" }}
                />
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || !form.full_name.trim()}
              className={classes.submitButton}
            >
              {loading ? "שולח..." : "שליחה"}
            </Button>

            <Typography className={classes.footer}>
              פרטיכם ישמרו בסודיות מוחלטת
            </Typography>
          </>
        )}
      </div>
    </div>
  );
}

export default PublicLeadFormView;
