import React, { useRef } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Box,
  Chip,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import { useStyles } from "./Flights.style";
import { useSelector } from "react-redux";
import { formatDateInput, isoToDisplay } from "../../../utils/HelperFunction/formatDate";

const FlightsView = (props) => {
  const {
    handleInputChange,
    submit,
    submitAndClose,
    handleCloseClicked,
    userClassificationType,
    embedded,
    familyFlights = [],
    onCopyFromGuest,
    flightsCompany = [],
  } = props;

  const classes = useStyles();
  const form = useSelector((state) => state.flightsSlice.form);
  const userForm = useSelector((state) => state.userSlice.form);
  const inputRefs = useRef([]);

  // Skip over null refs (conditional sections may not be mounted)
  const handleKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      let next = index + 1;
      while (next < inputRefs.current.length) {
        if (inputRefs.current[next]) { inputRefs.current[next].focus(); break; }
        next++;
      }
    }
  };

  const handleDateFieldChange = (e) => {
    handleInputChange({
      target: { name: e.target.name, value: formatDateInput(e.target.value) },
    });
  };

  const flyingWithUs =
    Number(userForm.flying_with_us) === 1 || userForm.flying_with_us === true;
  const direction = userForm?.flights_direction || "round_trip";
  const showOutbound =
    direction === "round_trip" || direction === "one_way_outbound";
  const showReturn =
    direction === "round_trip" || direction === "one_way_return";

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

      {/* Copy from another guest banner */}
      {familyFlights.length > 0 && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
            p: "10px 14px",
            backgroundColor: "#f0fdfa",
            border: "1px solid #99f6e4",
            borderRadius: "8px",
          }}
        >
          <ContentCopyIcon sx={{ fontSize: 15, color: "#0d9488" }} />
          <Typography style={{ fontSize: "12px", color: "#0f766e", fontWeight: 600 }}>
            העתק פרטי טיסה מ:
          </Typography>
          {familyFlights.map((f) => (
            <Chip
              key={f.user_id}
              label={`${f.hebrew_first_name} ${f.hebrew_last_name}`}
              size="small"
              onClick={() => onCopyFromGuest(f)}
              sx={{
                backgroundColor: "#ccfbf1",
                color: "#0f766e",
                border: "1px solid #5eead4",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                "&:hover": { backgroundColor: "#99f6e4" },
              }}
            />
          ))}
        </Box>
      )}

      {/* Passport & Classification */}
      <div className={classes.sectionCard}>
        <Typography className={classes.sectionTitle}>דרכון וסיווג</Typography>
        <div className={classes.fieldGroup}>
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>מספר דרכון</InputLabel>
            <TextField
              name="passport_number"
              value={form?.passport_number || ""}
              className={classes.textField}
              onChange={handleInputChange}
              size="small"
              placeholder="מספר דרכון"
              inputRef={(el) => (inputRefs.current[0] = el)}
              onKeyDown={(e) => handleKeyDown(e, 0)}
            />
          </div>
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>תוקף דרכון</InputLabel>
            <TextField
              name="validity_passport"
              value={isoToDisplay(form?.validity_passport) || ""}
              className={classes.textField}
              onChange={handleDateFieldChange}
              size="small"
              placeholder="DD/MM/YYYY"
              inputRef={(el) => (inputRefs.current[1] = el)}
              onKeyDown={(e) => handleKeyDown(e, 1)}
            />
          </div>
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>סיווג משתמש</InputLabel>
            <Select
              name="user_classification"
              value={form?.user_classification || ""}
              onChange={handleInputChange}
              input={<OutlinedInput className={classes.selectOutline} />}
              displayEmpty
              renderValue={(value) => value || "בחר..."}
              MenuProps={menuProps}
            >
              {userClassificationType.map((type) => (
                <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Flight details — only when flying with us + direction chosen */}
      {flyingWithUs && direction && (
        <>
          {showOutbound && (
            <div className={classes.sectionCard}>
              <Typography className={classes.sectionTitle}>
                <FlightTakeoffIcon style={{ fontSize: 20, color: "#0d9488" }} />
                טיסת הלוך
              </Typography>
              <div className={classes.fieldGroupThreeCol}>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>תאריך</InputLabel>
                  <TextField
                    name="outbound_flight_date"
                    value={isoToDisplay(form?.outbound_flight_date) || ""}
                    className={classes.textField}
                    onChange={handleDateFieldChange}
                    size="small"
                    placeholder="DD/MM/YYYY"
                    inputRef={(el) => (inputRefs.current[2] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 2)}
                  />
                </div>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>מספר טיסה</InputLabel>
                  <TextField
                    name="outbound_flight_number"
                    value={form?.outbound_flight_number || ""}
                    className={classes.textField}
                    onChange={handleInputChange}
                    size="small"
                    placeholder="לדוג' W64512"
                    inputRef={(el) => (inputRefs.current[3] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 3)}
                  />
                </div>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>חברת תעופה</InputLabel>
                  <Select
                    name="outbound_airline"
                    value={form?.outbound_airline || ""}
                    onChange={handleInputChange}
                    input={<OutlinedInput className={classes.selectOutline} />}
                    displayEmpty
                    renderValue={(value) => value || "בחר..."}
                    MenuProps={menuProps}
                  >
                    {flightsCompany.map((type) => (
                      <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          )}

          {showReturn && (
            <div className={classes.sectionCard}>
              <Typography className={classes.sectionTitle}>
                <FlightLandIcon style={{ fontSize: 20, color: "#0d9488" }} />
                טיסת חזור
              </Typography>
              <div className={classes.fieldGroupThreeCol}>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>תאריך</InputLabel>
                  <TextField
                    name="return_flight_date"
                    value={isoToDisplay(form?.return_flight_date) || ""}
                    className={classes.textField}
                    onChange={handleDateFieldChange}
                    size="small"
                    placeholder="DD/MM/YYYY"
                    inputRef={(el) => (inputRefs.current[4] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 4)}
                  />
                </div>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>מספר טיסה</InputLabel>
                  <TextField
                    name="return_flight_number"
                    value={form?.return_flight_number || ""}
                    className={classes.textField}
                    onChange={handleInputChange}
                    size="small"
                    placeholder="לדוג' W64513"
                    inputRef={(el) => (inputRefs.current[5] = el)}
                    onKeyDown={(e) => handleKeyDown(e, 5)}
                  />
                </div>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>חברת תעופה</InputLabel>
                  <Select
                    name="return_airline"
                    value={form?.return_airline || ""}
                    onChange={handleInputChange}
                    input={<OutlinedInput className={classes.selectOutline} />}
                    displayEmpty
                    renderValue={(value) => value || "בחר..."}
                    MenuProps={menuProps}
                  >
                    {flightsCompany.map((type) => (
                      <MenuItem key={type} value={type} className={classes.selectedMenuItem}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Source user checkbox */}
      <FormControlLabel
        label={
          <Typography style={{ color: "#475569", fontSize: "13px" }}>
            משמש כמקור מידע
          </Typography>
        }
        control={
          <Checkbox
            sx={{
              color: "#cbd5e1",
              "&.Mui-checked": { color: "#0d9488" },
            }}
            checked={form?.is_source_user === 1 || form?.is_source_user === true}
            name="is_source_user"
            onChange={handleInputChange}
          />
        }
        style={{ marginTop: "4px" }}
      />

      {!embedded && (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #f1f5f9", flexWrap: "wrap" }}>
          <Button onClick={submit} className={classes.submitButton}>
            שמור והמשך לשלב הבא
          </Button>
          <Button onClick={submitAndClose} className={classes.saveCloseButton}>
            שמור וסגור
          </Button>
          <Button className={classes.cancelButton} onClick={handleCloseClicked}>
            ביטול
          </Button>
        </div>
      )}
    </div>
  );
};

export default FlightsView;
