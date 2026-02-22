import React from "react";
import {
  CircularProgress,
  TextField,
  Button,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useStyles } from "./PublicBookingForm.style";

const GENDER_OPTIONS = [
  { value: "male", label: "זכר" },
  { value: "female", label: "נקבה" },
];

const FOOD_OPTIONS = [
  { value: "regular", label: "רגיל" },
  { value: "vegetarian", label: "צמחוני" },
  { value: "vegan", label: "טבעוני" },
  { value: "gluten_free", label: "ללא גלוטן" },
  { value: "kosher_mehadrin", label: "כשר מהדרין" },
];

const PAYMENT_OPTIONS = [
  { value: "bank_transfer", label: "העברה בנקאית" },
  { value: "credit_card", label: "כרטיס אשראי" },
  { value: "cash", label: "מזומן" },
];

function PublicBookingFormView(props) {
  const classes = useStyles();
  const {
    pageData,
    loading,
    error,
    submitting,
    submitted,
    contactName,
    setContactName,
    contactPhone,
    setContactPhone,
    contactEmail,
    setContactEmail,
    contactAddress,
    setContactAddress,
    paymentPreference,
    setPaymentPreference,
    specialRequests,
    setSpecialRequests,
    guests,
    handleGuestChange,
    addGuest,
    removeGuest,
    handleSubmit,
  } = props;

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={classes.centeredPage}>
        <CircularProgress style={{ color: "#0d9488" }} />
      </div>
    );
  }

  // ── Error (invalid link) ─────────────────────────────────────────────────────
  if (error && !submitted) {
    return (
      <div className={classes.centeredPage}>
        <div className={classes.errorCard}>
          <div className={classes.errorIcon}>⚠️</div>
          <p className={classes.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  // ── Already submitted — show read-only summary ───────────────────────────────
  if (pageData?.alreadySubmitted && !submitted) {
    const d = pageData.existing;
    const submittedDate = d?.submitted_at
      ? new Date(d.submitted_at).toLocaleDateString("he-IL")
      : "";
    return (
      <div className={classes.page} dir="rtl">
        <div className={classes.header}>
          <div className={classes.logoText}>Avimor Tourism Online</div>
          <div className={classes.headerTitle}>{pageData.vacationName}</div>
          <div className={classes.headerSubtitle}>טופס הזמנה — {pageData.familyName}</div>
        </div>
        <div className={classes.container}>
          <div className={classes.successCard}>
            <CheckCircleOutlineIcon style={{ fontSize: 52, color: "#22c55e", marginBottom: 8 }} />
            <div className={classes.successTitle}>הטופס כבר הוגש</div>
            {submittedDate && (
              <div className={classes.successSubtitle}>תאריך הגשה: {submittedDate}</div>
            )}
          </div>
          {d && (
            <div className={classes.summaryCard}>
              <div className={classes.sectionTitle}>פרטי יצירת קשר</div>
              <div className={classes.summaryRow}><span className={classes.summaryLabel}>שם:</span> {d.contact_name}</div>
              {d.contact_phone && <div className={classes.summaryRow}><span className={classes.summaryLabel}>טלפון:</span> {d.contact_phone}</div>}
              {d.contact_email && <div className={classes.summaryRow}><span className={classes.summaryLabel}>אימייל:</span> {d.contact_email}</div>}
              {d.contact_address && <div className={classes.summaryRow}><span className={classes.summaryLabel}>כתובת:</span> {d.contact_address}</div>}
              {d.payment_preference && <div className={classes.summaryRow}><span className={classes.summaryLabel}>אמצעי תשלום:</span> {PAYMENT_OPTIONS.find(p => p.value === d.payment_preference)?.label || d.payment_preference}</div>}
              {d.special_requests && (
                <>
                  <div className={classes.sectionTitle} style={{ marginTop: 12 }}>הערות ובקשות מיוחדות</div>
                  <div className={classes.summaryRow}>{d.special_requests}</div>
                </>
              )}
              {Array.isArray(d.guests) && d.guests.length > 0 && (
                <>
                  <div className={classes.sectionTitle} style={{ marginTop: 12 }}>נוסעים ({d.guests.length})</div>
                  {d.guests.map((g, i) => (
                    <div key={i} className={classes.guestSummaryRow}>
                      <span className={classes.guestIndex}>{i + 1}.</span>
                      <span>{g.full_name_he}{g.full_name_en ? ` / ${g.full_name_en}` : ""}</span>
                      {g.passport_number && <span className={classes.guestDetail}>דרכון: {g.passport_number}</span>}
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Success after submit ─────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className={classes.page} dir="rtl">
        <div className={classes.header}>
          <div className={classes.logoText}>Avimor Tourism Online</div>
          <div className={classes.headerTitle}>{pageData?.vacationName}</div>
          <div className={classes.headerSubtitle}>טופס הזמנה — {pageData?.familyName}</div>
        </div>
        <div className={classes.container}>
          <div className={classes.successCard}>
            <CheckCircleOutlineIcon style={{ fontSize: 56, color: "#22c55e", marginBottom: 12 }} />
            <div className={classes.successTitle}>הטופס הוגש בהצלחה!</div>
            <div className={classes.successSubtitle}>תודה רבה. פרטיכם התקבלו וישמשו לתכנון הנסיעה.</div>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────────
  return (
    <div className={classes.page} dir="rtl">
      {/* Header */}
      <div className={classes.header}>
        <div className={classes.logoText}>Avimor Tourism Online</div>
        <div className={classes.headerTitle}>{pageData?.vacationName}</div>
        <div className={classes.headerSubtitle}>טופס הזמנה — {pageData?.familyName}</div>
      </div>

      <div className={classes.container}>
        {/* ── Contact section ── */}
        <div className={classes.section}>
          <div className={classes.sectionTitle}>פרטי יצירת קשר</div>
          <div className={classes.fieldGrid}>
            <TextField
              label="שם מלא *"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              size="small"
              fullWidth
              className={classes.field}
              InputProps={{ className: classes.inputBase }}
              InputLabelProps={{ className: classes.label }}
            />
            <TextField
              label="טלפון"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              size="small"
              fullWidth
              className={classes.field}
              InputProps={{ className: classes.inputBase }}
              InputLabelProps={{ className: classes.label }}
            />
            <TextField
              label="אימייל"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              size="small"
              fullWidth
              type="email"
              className={classes.field}
              InputProps={{ className: classes.inputBase }}
              InputLabelProps={{ className: classes.label }}
            />
            <TextField
              label="כתובת"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              size="small"
              fullWidth
              className={classes.field}
              InputProps={{ className: classes.inputBase }}
              InputLabelProps={{ className: classes.label }}
            />
          </div>
        </div>

        {/* ── Guests section ── */}
        <div className={classes.section}>
          <div className={classes.sectionTitleRow}>
            <div className={classes.sectionTitle}>פרטי נוסעים</div>
            <Tooltip title="הוסף נוסע">
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={addGuest}
                className={classes.addGuestBtn}
              >
                הוסף נוסע
              </Button>
            </Tooltip>
          </div>

          {guests.map((guest, index) => (
            <div key={index} className={classes.guestCard}>
              <div className={classes.guestCardHeader}>
                <span className={classes.guestCardTitle}>נוסע {index + 1}</span>
                {guests.length > 1 && (
                  <IconButton size="small" onClick={() => removeGuest(index)} className={classes.removeGuestBtn}>
                    <DeleteOutlineIcon style={{ fontSize: 18 }} />
                  </IconButton>
                )}
              </div>
              <div className={classes.guestGrid}>
                <TextField
                  label="שם בעברית"
                  value={guest.fullNameHe}
                  onChange={(e) => handleGuestChange(index, "fullNameHe", e.target.value)}
                  size="small"
                  fullWidth
                  className={classes.field}
                  InputProps={{ className: classes.inputBase }}
                  InputLabelProps={{ className: classes.label }}
                />
                <TextField
                  label="שם באנגלית (כבדרכון)"
                  value={guest.fullNameEn}
                  onChange={(e) => handleGuestChange(index, "fullNameEn", e.target.value)}
                  size="small"
                  fullWidth
                  className={classes.field}
                  InputProps={{ className: classes.inputBase }}
                  InputLabelProps={{ className: classes.label }}
                />
                <TextField
                  label="מספר דרכון"
                  value={guest.passportNumber}
                  onChange={(e) => handleGuestChange(index, "passportNumber", e.target.value)}
                  size="small"
                  fullWidth
                  className={classes.field}
                  InputProps={{ className: classes.inputBase }}
                  InputLabelProps={{ className: classes.label }}
                />
                <TextField
                  label="תוקף דרכון (MM/YY)"
                  value={guest.passportExpiry}
                  onChange={(e) => handleGuestChange(index, "passportExpiry", e.target.value)}
                  size="small"
                  fullWidth
                  className={classes.field}
                  InputProps={{ className: classes.inputBase }}
                  InputLabelProps={{ className: classes.label }}
                />
                <TextField
                  label="תאריך לידה (DD/MM/YYYY)"
                  value={guest.dateOfBirth}
                  onChange={(e) => handleGuestChange(index, "dateOfBirth", e.target.value)}
                  size="small"
                  fullWidth
                  className={classes.field}
                  InputProps={{ className: classes.inputBase }}
                  InputLabelProps={{ className: classes.label }}
                />
                <TextField
                  label="מגדר"
                  value={guest.gender}
                  onChange={(e) => handleGuestChange(index, "gender", e.target.value)}
                  size="small"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  className={classes.field}
                  InputProps={{ className: classes.inputBase }}
                  InputLabelProps={{ className: classes.label, shrink: true }}
                >
                  <option value=""></option>
                  {GENDER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </TextField>
                <TextField
                  label="העדפות מזון"
                  value={guest.foodPreference}
                  onChange={(e) => handleGuestChange(index, "foodPreference", e.target.value)}
                  size="small"
                  fullWidth
                  select
                  SelectProps={{ native: true }}
                  className={classes.field}
                  InputProps={{ className: classes.inputBase }}
                  InputLabelProps={{ className: classes.label, shrink: true }}
                >
                  <option value=""></option>
                  {FOOD_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </TextField>
              </div>
            </div>
          ))}
        </div>

        {/* ── Special requests ── */}
        <div className={classes.section}>
          <div className={classes.sectionTitle}>הערות ובקשות מיוחדות</div>
          <TextField
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            multiline
            rows={3}
            fullWidth
            placeholder="כתבו כאן כל בקשה מיוחדת, הגבלות תזונה נוספות, צרכים רפואיים וכד'..."
            className={classes.field}
            InputProps={{ className: classes.inputBase }}
          />
        </div>

        {/* ── Payment preference ── */}
        <div className={classes.section}>
          <FormLabel className={classes.sectionTitle} component="legend">אמצעי תשלום מועדף</FormLabel>
          <RadioGroup
            row
            value={paymentPreference}
            onChange={(e) => setPaymentPreference(e.target.value)}
            style={{ gap: "8px", marginTop: "8px" }}
          >
            {PAYMENT_OPTIONS.map((o) => (
              <FormControlLabel
                key={o.value}
                value={o.value}
                control={<Radio size="small" style={{ color: "#0d9488" }} />}
                label={o.label}
                className={classes.radioLabel}
              />
            ))}
          </RadioGroup>
        </div>

        {/* ── Submit ── */}
        {error && <div className={classes.submitError}>{error}</div>}
        <Button
          className={classes.submitBtn}
          onClick={handleSubmit}
          disabled={!contactName.trim() || submitting}
          fullWidth
        >
          {submitting ? <CircularProgress size={22} style={{ color: "#fff" }} /> : "שלח טופס"}
        </Button>
      </div>
    </div>
  );
}

export default PublicBookingFormView;
