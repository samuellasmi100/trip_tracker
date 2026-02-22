import React from "react";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useStyles } from "../GuestWizard.style";
import { useSelector, useDispatch } from "react-redux";
import * as notesSlice from "../../../../store/slice/notesSlice";

const CategoryNotes = [
  { categoryName: "חדרים", id: 1 },
  { categoryName: "קולינרי", id: 2 },
  { categoryName: "טיסות", id: 3 },
  { categoryName: "חדר אוכל", id: 4 },
  { categoryName: "כללי", id: 5 },
  { categoryName: "נגישות", id: 6 },
];

function NotesStep() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const notesForm = useSelector((state) => state.notesSlice.form);

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    dispatch(notesSlice.updateFormField({ field: name, value }));
  };

  const menuProps = {
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

  return (
    <div className={classes.sectionCard}>
      <Typography className={classes.sectionTitle}>הערות</Typography>

      <div className={classes.fieldGroup}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.inputLabelStyle}>קטגוריה</InputLabel>
          <Select
            name="categoryName"
            value={notesForm?.categoryName || ""}
            onChange={handleNoteChange}
            input={<OutlinedInput className={classes.selectField} />}
            displayEmpty
            renderValue={(value) => value || "בחר קטגוריה..."}
            MenuProps={menuProps}
          >
            {CategoryNotes.map((type) => (
              <MenuItem key={type.id} value={type.categoryName} className={classes.menuItem}>
                {type.categoryName}
              </MenuItem>
            ))}
          </Select>
        </div>

        <div className={classes.fieldItemFull}>
          <InputLabel className={classes.inputLabelStyle}>הערה</InputLabel>
          <TextField
            multiline
            minRows={3}
            name="note"
            value={notesForm?.note || ""}
            className={classes.textField}
            onChange={handleNoteChange}
            size="small"
            placeholder="הוסף הערה..."
          />
        </div>
      </div>
    </div>
  );
}

export default NotesStep;
