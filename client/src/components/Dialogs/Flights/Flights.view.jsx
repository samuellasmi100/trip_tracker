import React, { useRef } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  ListItemText,
} from "@mui/material";
import { useStyles } from "./Flights.style";
import { useSelector } from "react-redux";
import "./Flights.css"

const FlightsView = (props) => {
  const classes = useStyles();
  const form = useSelector((state) => state.flightsSlice.form)
  const userForm = useSelector((state) => state.userSlice.form)
  const flightsCompany = ["HISKY","אל על", "טארום"]

  const handleFligthsInputsView = () => {
    if (userForm?.flights_direction === "round_trip") {
      return (
        <>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              תאריך טיסה חזור
            </InputLabel>
            <TextField
              type="date"
              name="return_flight_date"
              value={form?.return_flight_date}
              className={classes.textField}
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[6] = el)}
              onKeyDown={(e) => handleKeyDown(e, 6)}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              מספר טיסה הלוך
            </InputLabel>
            <TextField
              name="outbound_flight_number"
              value={form?.outbound_flight_number}
              className={classes.textField}
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[7] = el)}
              onKeyDown={(e) => handleKeyDown(e, 7)}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              מספר טיסה חזור
            </InputLabel>
            <TextField
              name="return_flight_number"
              value={form?.return_flight_number}
              className={classes.textField}
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[8] = el)}
              onKeyDown={(e) => handleKeyDown(e, 8)}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>חברת תעופה הלוך</InputLabel>
            <Select
             name="outbound_airline"
             value={form?.outbound_airline || ""}
             className={classes.textField}
             onChange={handleInputChange}
             inputRef={(el) => (inputRefs.current[9] = el)}
             onKeyDown={(e) => handleKeyDown(e, 9)}
              input={<OutlinedInput className={classes.selectOutline} />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    color: "#ffffff !important",
                    bgcolor: "#222222",
                  },
                },
              }}
            >
              {flightsCompany?.map((type) => (
                <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </Grid>
             <Grid item>
            <InputLabel className={classes.inputLabelStyle}>חברת תעופה חזור</InputLabel>
            <Select
             name="return_airline"
             value={form?.return_airline}
             className={classes.textField}
             onChange={handleInputChange}
             inputRef={(el) => (inputRefs.current[10] = el)}
             onKeyDown={(e) => handleKeyDown(e, 10)}
              input={<OutlinedInput className={classes.selectOutline} />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    color: "#ffffff !important",
                    bgcolor: "#222222",
                  },
                },
              }}
            >
              {flightsCompany?.map((type) => (
                <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </>
      );
    } else if (userForm?.flights_direction === "one_way_return") {
      return (
        <>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              תאריך טיסה חזור
            </InputLabel>
            <TextField
              type="date"
              name="return_flight_date"
              value={form?.return_flight_date}
              className={classes.textField}
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[6] = el)}
              onKeyDown={(e) => handleKeyDown(e, 6)}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              מספר טיסה חזור
            </InputLabel>
            <TextField
              name="return_flight_number"
              value={form?.return_flight_number}
              className={classes.textField}
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[7] = el)}
              onKeyDown={(e) => handleKeyDown(e, 7)}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>חברת תעופה חזור</InputLabel>
            <Select
             name="return_airline"
             value={form?.return_airline}
             className={classes.textField}
             onChange={handleInputChange}
             inputRef={(el) => (inputRefs.current[8] = el)}
             onKeyDown={(e) => handleKeyDown(e, 8)}
              input={<OutlinedInput className={classes.selectOutline} />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    color: "#ffffff !important",
                    bgcolor: "#222222",
                  },
                },
              }}
            >
              {flightsCompany?.map((type) => (
                <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </>
      );
    } else if (userForm?.flights_direction === "one_way_outbound") {
      return (
        <>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              תאריך טיסה הלוך
            </InputLabel>
            <TextField
              type="date"
              name="outbound_flight_date"
              value={form?.outbound_flight_date}
              className={classes.textField}
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[6] = el)}
              onKeyDown={(e) => handleKeyDown(e, 6)}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>
              מספר טיסה הלוך
            </InputLabel>
            <TextField
              name="outbound_flight_number"
              value={form?.outbound_flight_number}
              className={classes.textField}
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[7] = el)}
              onKeyDown={(e) => handleKeyDown(e, 7)}
            />
          </Grid>
          <Grid item>
            <InputLabel className={classes.inputLabelStyle}>חברת תעופה הלוך</InputLabel>
            <Select
              name="outbound_airline"
              value={form?.outbound_airline}
              className={classes.textField}
              onChange={handleInputChange}
              inputRef={(el) => (inputRefs.current[8] = el)}
              onKeyDown={(e) => handleKeyDown(e, 8)}
              input={<OutlinedInput className={classes.selectOutline} />}
              MenuProps={{
                PaperProps: {
                  sx: {
                    color: "#ffffff !important",
                    bgcolor: "#222222",
                  },
                },
              }}
            >
              {flightsCompany?.map((type) => (
                <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </>
      );
    }
  };

  const {
    handleInputChange,
    submit,
    handleCloseClicked,
    userClassificationType
  } = props;

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
  return (
    <>
      <Grid container style={{ minHeight: "420px", padding: "20px" }}>
        <Grid item xs={6}>
          <Grid container spacing={1} justifyContent="center">
            {[
              { label: "מספר דרכון", name: "passport_number" },
              { label: "תוקף", name: "validity_passport", type: "date" },
              { label: "תאריך לידה", name: "birth_date", type: "date" },
              { label: "גיל", name: "age" },
            ].map((field, index) => (
              <Grid item key={field.name}>
                <InputLabel className={classes.inputLabelStyle}>{field.label}</InputLabel>
                <TextField
                  name={field.name}
                  value={form[field.name]}
                  type={field.type || "text"}
                  className={classes.textField}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[index] = el)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              </Grid>
            ))}
            <Grid item>
              <InputLabel className={classes.inputLabelStyle}>סיווג משתמש</InputLabel>
              <Select
                name="user_classification"
                value={form.user_classification}
                onChange={handleInputChange}
                inputRef={(el) => (inputRefs.current[4] = el)} // Reference for Select
                onKeyDown={(e) => handleKeyDown(e, 4)}
                input={
                  <OutlinedInput
                    name="user_classification"
                    value={form.user_classification}
                    className={classes.selectOutline}
                  />
                }
                MenuProps={{
                  PaperProps: {
                    sx: {
                      color: "#ffffff !important",
                      bgcolor: "#222222",
                    },
                  },
                }}
              >
                {userClassificationType.map((type) => (
                  <MenuItem
                    key={type}
                    value={type}
                    className={classes.selectedMenuItem}
                  >
                    <ListItemText
                      primaryTypographyProps={{ fontSize: "16" }}
                      primary={type}
                    />
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={5}>
          <Grid container spacing={1} justifyContent="center">
            {userForm.flights_direction === "round_trip" && (
              <Grid item>
                <InputLabel className={classes.inputLabelStyle}>תאריך טיסה הלוך</InputLabel>
                <TextField
                  type="date"
                  name="outbound_flight_date"
                  value={form?.outbound_flight_date}
                  className={classes.textField}
                  onChange={handleInputChange}
                  inputRef={(el) => (inputRefs.current[5] = el)}
                  onKeyDown={(e) => handleKeyDown(e, 5)}
                />
              </Grid>
            )}
            {handleFligthsInputsView &&
              handleFligthsInputsView()?.props?.children?.map((child, index) => (
                <Grid item key={`flight-input-${index}`}>
                  {React.cloneElement(child, {
                    inputRef: (el) => (inputRefs.current[6 + index] = el),
                    onKeyDown: (e) => handleKeyDown(e, 6 + index),
                  })}
                </Grid>
              ))}
          </Grid>
        </Grid>

        <Grid item style={{ marginRight: "20px", marginTop: "20px" }}>
          <FormControlLabel
            label={
              <Typography style={{ color: "##757882", fontSize: "15px" }}>
                משמש כמקור מידע
              </Typography>
            }
            control={
              <Checkbox
                sx={{
                  color: "#686B76",
                  "&.Mui-checked": {
                    color: "#54A9FF",
                  },
                }}
                checked={
                  form?.is_source_user === 1 || form?.is_source_user === true
                }
                name="is_source_user"
                className={classes.checkbox}
                onChange={handleInputChange}
              />
            }
          />
        </Grid>
      </Grid>

      <Grid
        item
        xs={12}
        container
        style={{ marginTop: "50px" }}
        justifyContent="space-around"
      >
        <Grid item>
          <Button onClick={submit} className={classes.submitButton}>
            עדכן פרטי טיסה
          </Button>
        </Grid>
        <Grid item>
          <Button className={classes.cancelButton} onClick={handleCloseClicked}>
            סגור
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default FlightsView;
