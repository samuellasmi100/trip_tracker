import React from "react";
import {
  Button,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { useStyles } from "./Notes.style";
import { useSelector } from "react-redux";

const NotesView = (props) => {
  const classes = useStyles();
  const form = useSelector((state) => state.notesSlice.form);
  const CategoryNotes = [
    { categoryName: "חדרים", id: 1 },
    { categoryName: "קולינרי", id: 2 },
    { categoryName: "טיסות", id: 3 },
    { categoryName: "חדר אוכל", id: 4 },
    { categoryName: "כללי", id: 5 },
    { categoryName: "נגישות", id: 6 },
  ];
  const {
    handleInputChange,
    submit,
    handleCloseClicked,
    embedded,
  } = props;

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
    <div style={{ padding: embedded ? "0" : "24px", direction: "rtl" }}>
      <div style={{
        backgroundColor: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        padding: "24px 28px",
      }}>
        <Typography style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#475569",
          marginBottom: "20px",
        }}>
          הערות
        </Typography>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <InputLabel className={classes.inputLabelStyle}>קטגוריה</InputLabel>
            <Select
              name="categoryName"
              value={form?.categoryName || ""}
              onChange={handleInputChange}
              input={<OutlinedInput className={classes.selectOutline} />}
              displayEmpty
              renderValue={(value) => value || "בחר קטגוריה..."}
              MenuProps={menuProps}
            >
              {CategoryNotes?.map((type) => (
                <MenuItem key={type.id} value={type.categoryName} className={classes.selectedMenuItem}>
                  {type.categoryName}
                </MenuItem>
              ))}
            </Select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <InputLabel className={classes.inputLabelStyle}>הערה</InputLabel>
            <TextField
              multiline
              minRows={4}
              onChange={handleInputChange}
              name="note"
              value={form?.note || ""}
              className={classes.textField}
              placeholder="הוסף הערה..."
              size="small"
            />
          </div>
        </div>
      </div>

      {!embedded && (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
          <Button onClick={submit} className={classes.submitButton}>
            הוסף הערה
          </Button>
          <Button className={classes.cancelButton} onClick={handleCloseClicked}>
            סגור
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotesView;
