import {
  Grid,
  InputLabel,
  Button,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import React from "react";
import { useStyles } from "./Vacation.style";
import { useSelector } from "react-redux";

function VacationView({ handleInputChange, submit, handleCloseClicked }) {
  const classes = useStyles();
  const form = useSelector((state) => state.staticSlice.form);
  const detailsModalType = useSelector((state) => state.staticSlice.detailsModalType);
  const isEdit = detailsModalType === "editVacation";

  return (
    <Grid className={classes.wrapper}>
      <Typography className={classes.title}>
        {isEdit ? "עריכת חופשה" : "הוספת חופשה"}
      </Typography>

      <div className={classes.section}>
        <div className={classes.fieldGroup}>
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>שם חופשה</InputLabel>
            <TextField
              name="vacation_name"
              className={classes.textField}
              value={form?.vacation_name || ""}
              onChange={handleInputChange}
              size="small"
              placeholder="הזן שם..."
            />
          </div>
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>מספר מסלולים</InputLabel>
            <TextField
              name="vacation_routes"
              className={classes.textField}
              value={form?.vacation_routes || ""}
              onChange={handleInputChange}
              size="small"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {form?.vacation_routes > 0 && (
        <>
          <hr className={classes.divider} />
          <div className={classes.section}>
            <Typography className={classes.sectionLabel}>מסלולים</Typography>
            {Array.from({ length: form?.vacation_routes }).map((_, index) => (
              <div key={index} className={classes.routeCard}>
                <span className={classes.routeIndex}>#{index + 1}</span>
                <div className={classes.fieldItem} style={{ flex: 1 }}>
                  <InputLabel className={classes.inputLabelStyle}>מתאריך</InputLabel>
                  <TextField
                    name={`start_date_${index}`}
                    type="date"
                    value={form[`start_date_${index}`] || ""}
                    className={classes.dateField}
                    onChange={handleInputChange}
                    size="small"
                  />
                </div>
                <div className={classes.fieldItem} style={{ flex: 1 }}>
                  <InputLabel className={classes.inputLabelStyle}>עד תאריך</InputLabel>
                  <TextField
                    name={`end_date_${index}`}
                    type="date"
                    value={form[`end_date_${index}`] || ""}
                    className={classes.dateField}
                    onChange={handleInputChange}
                    size="small"
                  />
                </div>
              </div>
            ))}

            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "#cbd5e1",
                    "&.Mui-checked": {
                      color: "#0d9488",
                    },
                  }}
                  name="exceptions"
                  onClick={handleInputChange}
                  checked={form.exceptions || false}
                  size="small"
                />
              }
              label={
                <Typography className={classes.checkboxLabel}>
                  חריגים
                </Typography>
              }
              style={{ marginTop: "4px" }}
            />
          </div>
        </>
      )}

      <hr className={classes.divider} />

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

export default VacationView;
