import React, { useState, useEffect } from "react";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Typography,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import { useStyles } from "../GuestWizard.style";
import { useSelector, useDispatch } from "react-redux";
import * as flightsSlice from "../../../../store/slice/flightsSlice";
import { formatDateInput, isoToDisplay } from "../../../../utils/HelperFunction/formatDate";
import ApiSettings from "../../../../apis/settingsRequest";

function FlightDetailsStep() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const form = useSelector((state) => state.userSlice.form);
  const flightsForm = useSelector((state) => state.flightsSlice.form);

  const flyingWithUs = Number(form.flying_with_us) === 1 || form.flying_with_us === true;
  const direction = form?.flights_direction;
  const showOutbound = direction === "round_trip" || direction === "one_way_outbound";
  const showReturn = direction === "round_trip" || direction === "one_way_return";

  const [flightsCompany, setFlightsCompany] = useState([]);
  const userClassificationType = ["MR", "MRS", "BABY"];

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    ApiSettings.getFlightCompanies(token)
      .then((res) => {
        const names = (res.data || []).map((c) => c.name);
        setFlightsCompany(names);
      })
      .catch(() => setFlightsCompany([]));
  }, []);

  const dateFields = ["validity_passport", "outbound_flight_date", "return_flight_date"];

  const handleFlightFieldChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "is_source_user") {
      dispatch(flightsSlice.updateFormField({ field: name, value: checked }));
    } else if (dateFields.includes(name)) {
      dispatch(flightsSlice.updateFormField({ field: name, value: formatDateInput(value) }));
    } else {
      dispatch(flightsSlice.updateFormField({ field: name, value }));
    }
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

  if (!form.flights) {
    return (
      <div className={classes.flightEmptyState}>
        <FlightTakeoffIcon style={{ fontSize: 36, color: "#cbd5e1" }} />
        <Typography style={{ color: "#94a3b8", fontSize: 13, marginTop: 10 }}>
          יש לסמן "כולל טיסות" בלשונית פרטי נסיעה
        </Typography>
      </div>
    );
  }

  return (
    <>
      {/* Passport & Classification */}
      <div className={classes.sectionCard}>
        <div className={classes.flightSectionHeader}>
          <Typography className={classes.sectionTitle} style={{ marginBottom: 0 }}>דרכון וסיווג</Typography>
        </div>
        <div className={classes.fieldGroup}>
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>מספר דרכון</InputLabel>
            <TextField
              name="passport_number"
              value={flightsForm?.passport_number || ""}
              className={classes.textField}
              onChange={handleFlightFieldChange}
              size="small"
              placeholder="מספר דרכון"
            />
          </div>
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>תוקף דרכון</InputLabel>
            <TextField
              name="validity_passport"
              value={isoToDisplay(flightsForm?.validity_passport) || ""}
              className={classes.textField}
              onChange={handleFlightFieldChange}
              size="small"
              placeholder="DD/MM/YYYY"
            />
          </div>
          <div className={classes.fieldItem}>
            <InputLabel className={classes.inputLabelStyle}>סיווג משתמש</InputLabel>
            <Select
              name="user_classification"
              value={flightsForm?.user_classification || ""}
              onChange={handleFlightFieldChange}
              input={<OutlinedInput className={classes.selectField} />}
              displayEmpty
              renderValue={(value) => value || "בחר..."}
              MenuProps={menuProps}
            >
              {userClassificationType.map((type) => (
                <MenuItem key={type} value={type} className={classes.menuItem}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Flight rows */}
      {flyingWithUs && direction ? (
        <>
          {/* Outbound */}
          {showOutbound && (
            <div className={classes.sectionCard}>
              <div className={classes.flightSectionHeader}>
                <FlightTakeoffIcon style={{ fontSize: 20, color: "#0d9488" }} />
                <Typography className={classes.flightRowTitle}>טיסת הלוך</Typography>
              </div>
              <div className={classes.fieldGroup}>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>תאריך</InputLabel>
                  <TextField
                    name="outbound_flight_date"
                    value={isoToDisplay(flightsForm?.outbound_flight_date) || ""}
                    className={classes.textField}
                    onChange={handleFlightFieldChange}
                    size="small"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>חברת תעופה</InputLabel>
                  <Select
                    name="outbound_airline"
                    value={flightsForm?.outbound_airline || ""}
                    onChange={handleFlightFieldChange}
                    input={<OutlinedInput className={classes.selectField} />}
                    displayEmpty
                    renderValue={(value) => value || "בחר..."}
                    MenuProps={menuProps}
                  >
                    {flightsCompany.map((type) => (
                      <MenuItem key={type} value={type} className={classes.menuItem}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>מספר טיסה</InputLabel>
                  <TextField
                    name="outbound_flight_number"
                    value={flightsForm?.outbound_flight_number || ""}
                    className={classes.textField}
                    onChange={handleFlightFieldChange}
                    size="small"
                    placeholder="לדוג' W64512"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Return */}
          {showReturn && (
            <div className={classes.sectionCard}>
              <div className={classes.flightSectionHeader}>
                <FlightLandIcon style={{ fontSize: 20, color: "#0d9488" }} />
                <Typography className={classes.flightRowTitle}>טיסת חזור</Typography>
              </div>
              <div className={classes.fieldGroup}>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>תאריך</InputLabel>
                  <TextField
                    name="return_flight_date"
                    value={isoToDisplay(flightsForm?.return_flight_date) || ""}
                    className={classes.textField}
                    onChange={handleFlightFieldChange}
                    size="small"
                    placeholder="DD/MM/YYYY"
                  />
                </div>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>חברת תעופה</InputLabel>
                  <Select
                    name="return_airline"
                    value={flightsForm?.return_airline || ""}
                    onChange={handleFlightFieldChange}
                    input={<OutlinedInput className={classes.selectField} />}
                    displayEmpty
                    renderValue={(value) => value || "בחר..."}
                    MenuProps={menuProps}
                  >
                    {flightsCompany.map((type) => (
                      <MenuItem key={type} value={type} className={classes.menuItem}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.inputLabelStyle}>מספר טיסה</InputLabel>
                  <TextField
                    name="return_flight_number"
                    value={flightsForm?.return_flight_number || ""}
                    className={classes.textField}
                    onChange={handleFlightFieldChange}
                    size="small"
                    placeholder="לדוג' W64513"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className={classes.flightEmptyState} style={{ padding: "28px 20px" }}>
          <Typography style={{ color: "#94a3b8", fontSize: 12.5 }}>
            {!flyingWithUs
              ? "סמן \"טסים איתנו\" בלשונית פרטי נסיעה כדי להוסיף פרטי טיסות"
              : "בחר כיוון טיסה בלשונית פרטי נסיעה"}
          </Typography>
        </div>
      )}
    </>
  );
}

export default FlightDetailsStep;
