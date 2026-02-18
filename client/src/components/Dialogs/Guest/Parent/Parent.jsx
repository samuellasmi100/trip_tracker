import React, { useRef } from "react";
import {
  Grid,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  ListItemText,
  OutlinedInput
} from "@mui/material";
import { useStyles } from "../Guest.style";
import { useSelector } from "react-redux";

function Parent({ areaCodes, handleInputChange }) {
  const inputRefs = useRef([]);
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const classes = useStyles();
  const form = useSelector((state) => state.userSlice.form)
  
  return (
    <>
      <Grid container>
        <Grid item xs={6}>
          <Grid container spacing={2} justifyContent="center">
            {[
              { label: "שם פרטי בעברית", name: "hebrew_first_name" },
              { label: "שם משפחה בעברית", name: "hebrew_last_name" },
              { label: "שם פרטי באנגלית", name: "english_first_name" },
              { label: "שם משפחה באנגלית", name: "english_last_name" },
              { label: "תאריך לידה", name: "birth_date", type: "date" },
            ].map((field, index) => (
              <Grid item key={field.name}>
                <InputLabel className={classes.inputLabelStyle}>{field.label}</InputLabel>
                <TextField
                  name={field.name}
                  value={form[field.name]}
                  type={field.type || "text"}
                  className={field.label !== "תאריך לידה" ? classes.textField : classes.dateTextField}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={5}>
          <Grid container spacing={2} justifyContent="center">
            {[
              { label: "גיל", name: "age" },
              { label: "מספר זהות", name: "identity_id" },
              { label: "אימייל", name: "email" },
              { label: "כתובת מלאה", name: "address" },
            ].map((field, index) => (
              <Grid item key={field.name}>
                <InputLabel className={classes.inputLabelStyle}>{field.label}</InputLabel>
                <TextField
                  name={field.name}
                  value={form[field.name]}
                  className={classes.textField}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[index + 5] = el)} // Offset index by 5 for the second column
                  onKeyDown={(e) => handleKeyDown(e, index + 5)}
                />
              </Grid>
            ))}
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>מספר טלפון</InputLabel>
              <Grid container>
                <Grid style={{ paddingLeft: "10px" }}>
                  <TextField
                    name="phone_b"
                    value={form.phone_b}
                    className={classes.textFieldPhone}
                    onChange={handleInputChange}
                    inputRef={(el) => (inputRefs.current[9] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 9)}
                  />
                </Grid>
                <Grid>
                  <Select
                    name="phone_a"
                    value={form.phone_a}
                    onChange={handleInputChange}
                    input={
                      <OutlinedInput
                        name="phoneA"
                        value={form.phoneA}
                        className={classes.selectOutline}
                      />
                    }
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          color: "#1e293b !important",
                          bgcolor: "#ffffff",
                        },
                      },
                    }}
                  >
                    {areaCodes.map((region) => (
                      <MenuItem key={region} value={region} className={classes.selectedMenuItem}>
                        <ListItemText primaryTypographyProps={{ fontSize: "16" }} primary={region} />
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Parent;
