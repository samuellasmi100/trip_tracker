import React from "react";
import { Dialog, DialogTitle, DialogContent, Typography } from "@mui/material";
import { useStyles } from "./SubFamilyPickerDialog.style";

// Presentational only. Lists the sub-family choices (surname + count, largest
// first, plus "כל הקבוצה"); clicking one calls onPick(value).
function SubFamilyPickerDialogView({ open, options, familyName, onPick, onClose }) {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.paper }} style={{ zIndex: 1600 }}>
      <DialogTitle className={classes.title}>בחירת תת-משפחה</DialogTitle>
      <Typography className={classes.subtitle}>
        {familyName ? `${familyName} · ` : ""}לאיזו תת-משפחה להחיל את הטיסות?
      </Typography>
      <DialogContent className={classes.content}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            disabled={o.disabled}
            className={o.disabled ? classes.optionDone : classes.option}
            onClick={() => { if (!o.disabled) onPick(o.value); }}
          >
            <span className={classes.optionLabel}>
              {o.label}{o.done ? " — הפרטים מולאו" : ""}
            </span>
            {!o.done && <span className={classes.optionCount}>{o.count}</span>}
          </button>
        ))}
      </DialogContent>
    </Dialog>
  );
}

export default SubFamilyPickerDialogView;
