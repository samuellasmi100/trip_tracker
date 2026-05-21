import {
  Grid,
  TextField,
  InputLabel,
  Button,
  Typography,
} from "@mui/material";
import { useStyles } from "./Room.style";
import React from "react";
import { useSelector } from "react-redux";

function RoomView({ submit, handleInputChange, handleCloseClicked }) {
  const classes = useStyles();
  const form = useSelector((state) => state.staticSlice.form);

  return (
    <Grid className={classes.wrapper}>
      <Typography className={classes.title}>עדכון חדר</Typography>

      <div className={classes.fieldGroup}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>מספר חדר</InputLabel>
          <TextField
            name="rooms_id"
            className={classes.textField}
            value={form?.rooms_id}
            disabled
            size="small"
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>סוג חדר</InputLabel>
          <TextField
            name="type"
            className={classes.textField}
            value={form?.type}
            disabled
            size="small"
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>קומה</InputLabel>
          <TextField
            name="floor"
            className={classes.textField}
            value={form?.floor}
            disabled
            size="small"
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>כיוון</InputLabel>
          <TextField
            name="direction"
            className={classes.textField}
            value={form?.direction}
            disabled
            size="small"
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>גודל</InputLabel>
          <TextField
            name="size"
            className={classes.textField}
            value={form?.size}
            disabled
            size="small"
          />
        </div>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>תפוסה בסיסית</InputLabel>
          <TextField
            name="base_occupancy"
            className={classes.textField}
            value={form?.base_occupancy}
            disabled
            size="small"
          />
        </div>
      </div>

      <hr className={classes.divider} />

      <div className={classes.fieldGroup} style={{ gridTemplateColumns: "1fr" }}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle} style={{ color: "#0d9488" }}>
            תפוסה מקסימלית
          </InputLabel>
          <TextField
            name="max_occupancy"
            className={`${classes.textField} ${classes.editableField}`}
            value={form?.max_occupancy}
            onChange={handleInputChange}
            size="small"
          />
        </div>
      </div>

      <div className={classes.actions}>
        <Button onClick={submit} className={classes.submitButton}>
          עדכן
        </Button>
        <Button onClick={handleCloseClicked} className={classes.cancelButton}>
          ביטול
        </Button>
      </div>
    </Grid>
  );
}

export default RoomView;
