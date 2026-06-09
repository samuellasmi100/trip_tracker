import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  OutlinedInput,
  Switch,
  Typography,
} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import { useStyles } from "./GroupFlightsDialog.style";

// The 3 directions, mirroring the single-person editor's radio group.
const DIRECTION_OPTIONS = [
  { value: "round_trip", label: "הלוך ושוב" },
  { value: "one_way_outbound", label: "הלוך בלבד" },
  { value: "one_way_return", label: "חזור בלבד" },
];

const menuProps = {
  style: { zIndex: 1700 },
  PaperProps: {
    sx: { bgcolor: "#ffffff", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: "1px solid #e2e8f0" },
  },
};

function GroupFlightsDialogView({
  open,
  familyName,
  scopeLabel,
  legs,
  flightsCompany,
  onLegChange,
  copyFromOptions,
  copyFromValue,
  onCopyFrom,
  people,
  flyingCount,
  onTogglePerson,
  onSetDirection,
  onSetPassport,
  saving,
  onSubmit,
  onClose,
}) {
  const classes = useStyles();

  const airlineSelect = (name) => (
    <Select
      value={legs[name] || ""}
      onChange={(e) => onLegChange(name, e.target.value)}
      input={<OutlinedInput className={classes.field} />}
      displayEmpty
      renderValue={(value) => value || "בחר..."}
      size="small"
      MenuProps={menuProps}
    >
      {flightsCompany.map((c) => (
        <MenuItem key={c} value={c}>{c}</MenuItem>
      ))}
    </Select>
  );

  const textField = (name, placeholder) => (
    <TextField
      value={legs[name] || ""}
      onChange={(e) => onLegChange(name, e.target.value)}
      size="small"
      className={classes.field}
      placeholder={placeholder}
    />
  );

  const legGroup = (title, icon, dateName, airlineName, numberName) => (
    <div className={classes.legGroup}>
      <div className={classes.legHeader}>
        {icon}
        <Typography className={classes.legTitle}>{title}</Typography>
      </div>
      <div className={classes.legFields}>
        <div className={classes.fieldItem}>
          <span className={classes.fieldLabel}>תאריך</span>
          {textField(dateName, "DD/MM/YYYY")}
        </div>
        <div className={classes.fieldItem}>
          <span className={classes.fieldLabel}>חברת תעופה</span>
          {airlineSelect(airlineName)}
        </div>
        <div className={classes.fieldItem}>
          <span className={classes.fieldLabel}>מספר טיסה</span>
          {textField(numberName, "לדוג' W64512")}
        </div>
      </div>
    </div>
  );

  const personLabel = (p) => {
    const he = [p.hebrew_first_name, p.hebrew_last_name].filter(Boolean).join(" ").trim();
    const en = [p.english_first_name, p.english_last_name].filter(Boolean).join(" ").trim();
    return he || en || p.identity_id || "—";
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.paper }} style={{ zIndex: 1600 }}>
      <DialogTitle className={classes.title}>טיסות לקבוצה</DialogTitle>
      <Typography className={classes.subtitle}>
        {familyName ? `${familyName} · ` : ""}סמנו מי טס, בחרו כיוון ומלאו פרטי טיסה פעם אחת
      </Typography>

      <DialogContent className={classes.content}>
        <div className={classes.legsCard}>
          <div className={classes.legsCardHeader}>
            <Typography className={classes.legsCardTitle}>פרטי טיסה משותפים</Typography>
            {copyFromOptions.length > 0 && (
              <Select
                className={classes.copyFromSelect}
                value={copyFromValue || ""}
                onChange={(e) => onCopyFrom(e.target.value)}
                input={<OutlinedInput />}
                displayEmpty
                renderValue={(val) => {
                  const chosen = copyFromOptions.find((o) => o.user_id === val);
                  return chosen ? `הועתק מ${chosen.label}` : "העתק פרטי טיסה מ...";
                }}
                size="small"
                MenuProps={menuProps}
              >
                {copyFromOptions.map((o) => (
                  <MenuItem key={o.user_id} value={o.user_id} sx={{ fontSize: "13px" }}>{o.label}</MenuItem>
                ))}
              </Select>
            )}
          </div>
          {legGroup(
            "טיסת הלוך",
            <FlightTakeoffIcon style={{ fontSize: 18, color: "#0d9488" }} />,
            "outbound_flight_date", "outbound_airline", "outbound_flight_number"
          )}
          {legGroup(
            "טיסת חזור",
            <FlightLandIcon style={{ fontSize: 18, color: "#0d9488" }} />,
            "return_flight_date", "return_airline", "return_flight_number"
          )}
        </div>

        <div className={classes.listHeader}>
          <span className={classes.listTitle}>אנשים בקבוצה ({flyingCount} נבחרו)</span>
          {/* Scope was chosen at entry (button click) — shown here, not editable. */}
          {scopeLabel && <span className={classes.scopeBadge}>{scopeLabel}</span>}
        </div>

        <div className={classes.peopleScroll}>
          {people.length === 0 ? (
            <div className={classes.emptyPeople}>אין אנשים בקבוצה</div>
          ) : (
            people.map((p) => (
              <div className={classes.personCard} key={p.user_id}>
                <div className={classes.personRow}>
                  <Switch
                    checked={p.flying}
                    disabled={p.locked}
                    onChange={() => onTogglePerson(p.user_id)}
                    size="small"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": { color: "#0d9488" },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#0d9488" },
                    }}
                  />
                  <span className={classes.personName}>{personLabel(p)}</span>
                  {p.hasFlights && <span className={classes.hasFlightsTag}>יש טיסה</span>}
                  {p.is_main_user ? <span className={classes.personMeta}>ראש משפחה</span> : null}
                  {!p.locked && (p.flying ? (
                    <Select
                      className={classes.directionSelect}
                      value={p.direction || "round_trip"}
                      onChange={(e) => onSetDirection(p.user_id, e.target.value)}
                      input={<OutlinedInput />}
                      size="small"
                      MenuProps={menuProps}
                    >
                      {DIRECTION_OPTIONS.map((d) => (
                        <MenuItem key={d.value} value={d.value} sx={{ fontSize: "13px" }}>{d.label}</MenuItem>
                      ))}
                    </Select>
                  ) : (
                    <span className={classes.directionPlaceholder}>לא טס</span>
                  ))}
                </div>

                {p.locked ? (
                  // Already has flight data → excluded from the group apply.
                  <div className={classes.lockedNote}>שינוי שלו יבוצע באופן פרטני דרך העמוד שלו</div>
                ) : (
                  // Per-person passport — personal, never shared / never overwritten by the apply
                  <div className={classes.passportLine}>
                    <span className={classes.passportLabel}>דרכון</span>
                    <TextField
                      value={p.passport_number || ""}
                      onChange={(e) => onSetPassport(p.user_id, "passport_number", e.target.value)}
                      size="small"
                      className={classes.passportField}
                      placeholder="מספר דרכון"
                    />
                    <TextField
                      value={p.validity_passport || ""}
                      onChange={(e) => onSetPassport(p.user_id, "validity_passport", e.target.value)}
                      size="small"
                      className={classes.passportField}
                      placeholder="תוקף דרכון (DD/MM/YYYY)"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>

      <DialogActions className={classes.actions}>
        <Button className={classes.submitBtn} onClick={onSubmit} disabled={saving}>
          החל על הקבוצה
        </Button>
        <Button className={classes.cancelBtn} onClick={onClose} disabled={saving}>
          ביטול
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default GroupFlightsDialogView;
