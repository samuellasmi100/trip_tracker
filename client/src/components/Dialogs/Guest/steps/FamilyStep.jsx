import React from "react";
import {
  TextField,
  InputLabel,
  Typography,
} from "@mui/material";
import { useStyles } from "../GuestWizard.style";
import { useSelector } from "react-redux";

function FamilyStep({ handleInputChange }) {
  const classes = useStyles();
  const form = useSelector((state) => state.userSlice.form);

  return (
    <div className={classes.sectionCard}>
      <Typography className={classes.sectionTitle}>פרטי משפחה / קבוצה</Typography>

      <div className={classes.fieldGroup}>
        <div className={classes.fieldItemFull}>
          <InputLabel className={classes.inputLabelStyle}>שם משפחה / קבוצה</InputLabel>
          <TextField
            name="family_name"
            value={form.family_name || ""}
            className={classes.textField}
            onChange={handleInputChange}
            size="small"
            placeholder="הזן שם משפחה או קבוצה..."
          />
        </div>
      </div>
    </div>
  );
}

export default FamilyStep;
