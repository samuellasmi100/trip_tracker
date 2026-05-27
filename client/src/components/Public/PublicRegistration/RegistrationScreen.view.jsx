import React from "react";
import {
  Typography, TextField, Button, InputLabel,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GestureIcon from "@mui/icons-material/Gesture";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import CheckIcon from "@mui/icons-material/Check";
import { useStyles } from "./RegistrationScreen.style";

// Mirrors server/services/registrations/staticTerms.js. Source of truth for
// the signed PDF stays on the server; this duplicate is the preview rendered
// inline on the public form. Edit both when wording changes.
const TERMS_SECTIONS = [
  {
    title: "מדיניות ביטולים",
    body:
`תנאי דמי ביטול לאורח: חברתנו מאפשרת ביטול רישום על ידי הודעה בכתב למשרד.
דמי רישום בסך 500 ₪ לאדם – מ-4 נפשות ומעלה 250 ₪ לאדם – אינם ניתנים להחזר בכל מקרה של ביטול על ידיכם.
מ-90 עד 60 ימי עבודה לפני היציאה – ינוכו 10% מסך העסקה.
מ-60 עד 45 ימי עבודה לפני היציאה – ינוכו 30% מסך העסקה.
מ-45 עד 30 ימי עבודה לפני היציאה – ינוכו 60% מסך העסקה.
החל מ-30 ימי עבודה לפני מועד היציאה – יחולט מלוא סכום העסקה.
בעקבות המצב כיום יובהר כי: ככל שחלילה לא ניתן יהיה לבצע את החופשה, יוחזר מלוא הסכום לאורחים. במקרה של ביטול חלילה באילוץ, חברתנו שומרת את הזכות להשארת סך של עד 1000 ₪ לחדר לצורך כיסוי עלויות משרד ורישום.
מומלץ לעשות ביטוח בהתאם לתנאי דמי הביטול.`,
  },
  {
    title: "פרטי חשבון לתשלום",
    body:
`את התשלום נא להפקיד לחשבון הבנק שפרטיו רשומים מטה.
להעברה בנקאית יש צורך להפקיד ל:
בנק: דיסקונט
מס' סניף: 69 (בית הכרם)
מס' חשבון: 141414
ע"ש: חופשה כשרה ושמחה בע"מ
IBAN: IL1011069000019140251
יש לציין בנתוני העברה: תשלום עבור {{vacationName}}.
לאחר העברה נא להודיע כי בוצעה.
על עסקאות באשראי תחול עמלה בסך של 2%.
המחירים אינם כוללים: טיולים, ביטוחים, טיפים בסך 25 יורו לאדם.`,
  },
  {
    title: "תנאים כלליים",
    body:
`דרכון: באחריות האורח להצטייד בדרכון תקף ל-3 חודשים לפחות מיום החזרה לארץ.
דמי ביטול: על פי תקנון החברה.
כללי ההתנהגות במלון הינם ע"פ הוראות המלון (עישון במקומות שאינם מסומנים, לכלוך, התנהגות שאינה הולמת וכו'). העובר על הכללים עלול להיקנס.
ביטוח: במקביל לסגירת ההזמנה באחריותו של האורח לדאוג לביטוח רפואי ומטען מתאים לפי צרכיו, גילו ומצב בריאותו.
לחברתנו שמורה הזכות לביטול החופשה. היה וחברתנו נאלצת לבטל את החופשה מכל סיבה, יוחזר מלוא התמורה לאורח.
תנאי הביטול לנופש האמורים לעיל הינם לכלל הלקוחות, כולל לקוחות האמורים בחוק להגנת הצרכן.
בחתימה על טופס זה אני מצהיר כי היה לי קשר ישיר עם המוכר ולאור זאת חתמתי.
הנופש, הטיולים והתוכניות כפופים לשינויים ע"פ הוראת מדינת היעד של הנופש.
תוכנית הטיולים כפופה לשינויים והאחריות עליהם הינה של חברת האוטובוסים.
הטסים באופן עצמאי יגיעו למלון בכוחות עצמם ובתיאום עימנו בלבד. אין להגיע לפני הקבוצה.
לנוחותכם אנו דואגים להסעות משדה התעופה למלון בו אנו מתארחים, אך האחריות על הזמנים ועל ההעברות הינה על המוביל.
המחיר אינו כולל ביטוחים מכל סוג שהוא.
ההזמנה תתבצע רק לאחר החזרת טופס זה חתום, משלוח צילום דרכון של כל אורח – העמוד עם התמונה בלבד – ותשלום דמי הרישום בסך שליש מכלל העסקה לאורח, בצירוף פרטי אשראי.
תשלום העסקה יתבצע כפי הסיכום ויושלם במלואו עד 30 ימי עסקים לפני היציאה.
ט.ל.ח.`,
  },
  {
    title: "כשרות",
    body:
`הכשרות למהדרין במלון בתקופה זו הינה על חדר האוכל, המטבח, והמזון של הקבוצה ועל כל הקשור למזון.`,
  },
  {
    title: "פרטי המלון והחברה",
    body:
`חופשת הקיץ הינה במלון אאורליוס.
חבילת הנופש כוללת: מלון, חצי פנסיון, ספא חופשי, ספא נפרד בין השעות 09:00-24:00, קפיטריה חופשית.
כתובתנו: חופשה כשרה ושמחה בע"מ, אלונים 13 רכסים, ת.ד. 1475.
מחכים לראותכם, חברת אבימור וכל הצוות.`,
  },
];

// Static "package description" line — lifted from TERMS_SECTIONS[4] for
// visual prominence near the top, mirroring the paper form's blue box.
const PACKAGE_DESCRIPTION =
  "חבילת הנופש כוללת: מלון, חצי פנסיון, ספא חופשי, ספא נפרד בין השעות 09:00-24:00, קפיטריה חופשית.";

// Payment-method options in the order shown on the original paper form's
// checkbox row. Matches the canonical list in shared/Payments/Payments.view.jsx.
const PAYMENT_METHODS = ["המחאות", "כרטיס אשראי", "העברה בנקאית", "מזומן"];

// ─── small formatters (mirror server/services/registrations/pdfGenerator.js)

const fmtDate = (v) => {
  if (!v) return "—";
  const s = String(v).trim();
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`;
  const eu = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (eu) return s;
  return s;
};

const fmtDateTime = (v) => {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fmtMoney = (v) => {
  if (v == null || v === "") return "—";
  const n = parseFloat(String(v).replace(/,/g, ""));
  if (Number.isNaN(n)) return String(v);
  return `₪${n.toLocaleString("en-US")}`;
};

const fmtOrDash = (v) => (v == null || v === "" ? "—" : String(v));

function RegistrationScreenView({
  pageData, formData, form, onChange,
  canvasRef, canvasEmpty, startDraw, draw, stopDraw, clearCanvas,
  submitting, submitted, submitError, handleSubmit,
}) {
  const classes = useStyles();

  if (submitted) {
    return (
      <div className={classes.successBlock}>
        <CheckCircleOutlineIcon className={classes.successIcon} />
        <Typography className={classes.successTitle}>תודה! הטופס נשלח</Typography>
        <Typography className={classes.successText}>
          הטופס נחתם ונשלח בהצלחה.
          <br />
          העתק חתום של הטופס נשמר במערכת.
        </Typography>
      </div>
    );
  }

  // Source-of-truth for the read-only display fields is formData (returned
  // by the verify endpoint). Fall back to pageData fields where they overlap.
  const fd = formData || {};
  const selectedMethod = (fd.paymentMethod || "").trim();
  const headFullName = [fd.headFirstName, fd.headLastName].filter(Boolean).join(" ").trim()
    || pageData?.headFirstName || "—";

  return (
    <>
      {/* ─── 1. PACKAGE DESCRIPTION ─────────────────────────────────────── */}
      <div className={classes.section}>
        <div className={classes.packageBox}>
          <Typography className={classes.packageLabel}>חבילת הנופש</Typography>
          <Typography className={classes.packageText}>
            {PACKAGE_DESCRIPTION}
          </Typography>
          <Typography className={classes.packageDates}>
            תאריכי אירוח:
            <span className={classes.packageDatesValue}>
              {fmtDate(fd.stayStartDate)} עד {fmtDate(fd.stayEndDate)}
            </span>
          </Typography>
        </div>
      </div>

      {/* ─── 2. ORDERER DETAILS (read-only + editable) ──────────────────── */}
      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>
          <PersonOutlineOutlinedIcon className={classes.sectionIcon} />
          פרטי המזמין
        </Typography>
        <div className={classes.ordererGrid}>
          {/* Left: read-only meta */}
          <div className={classes.ordererBlock}>
            <Typography className={classes.ordererBlockTitle}>פרטים במערכת</Typography>
            <div className={classes.readonlyRow}>
              <Typography className={classes.readonlyLabel}>תאריך רישום</Typography>
              <Typography className={classes.readonlyValue}>{fmtDateTime(fd.requestCreatedAt)}</Typography>
            </div>
            <div className={classes.readonlyRow}>
              <Typography className={classes.readonlyLabel}>שם</Typography>
              <Typography className={classes.readonlyValue} style={{ direction: "rtl" }}>
                {headFullName}
              </Typography>
            </div>
            <div className={classes.readonlyRow}>
              <Typography className={classes.readonlyLabel}>טלפון נייד</Typography>
              <Typography className={classes.readonlyValue}>{fmtOrDash(fd.headPhone)}</Typography>
            </div>
            <div className={classes.readonlyRow}>
              <Typography className={classes.readonlyLabel}>אימייל</Typography>
              <Typography className={classes.readonlyValue}>{fmtOrDash(fd.headEmail)}</Typography>
            </div>
          </div>

          {/* Right: editable address */}
          <div className={classes.ordererBlock}>
            <Typography className={classes.ordererBlockTitle}>פרטים למילוי</Typography>
            <div className={classes.editableGroup}>
              <div className={classes.fieldItem}>
                <InputLabel className={classes.label}>כתובת</InputLabel>
                <TextField
                  className={classes.textField}
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                  size="small"
                  placeholder="רחוב ומספר בית"
                  inputProps={{ dir: "rtl" }}
                />
              </div>
              <div className={classes.fieldRow}>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.label}>עיר</InputLabel>
                  <TextField
                    className={classes.textField}
                    value={form.city}
                    onChange={(e) => onChange("city", e.target.value)}
                    size="small"
                    placeholder="ירושלים"
                    inputProps={{ dir: "rtl" }}
                  />
                </div>
                <div className={classes.fieldItem}>
                  <InputLabel className={classes.label}>מיקוד</InputLabel>
                  <TextField
                    className={classes.textField}
                    value={form.postal_code}
                    onChange={(e) => onChange("postal_code", e.target.value)}
                    size="small"
                    placeholder="0000000"
                    inputProps={{ inputMode: "numeric", dir: "ltr" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 3. GENERAL NOTES (full width) ──────────────────────────────── */}
      <div className={classes.section}>
        <div className={classes.fieldItem}>
          <InputLabel className={classes.label}>הערות (אופציונלי)</InputLabel>
          <TextField
            className={classes.textField}
            value={form.general_notes}
            onChange={(e) => onChange("general_notes", e.target.value)}
            size="small"
            placeholder="בקשות מיוחדות, הערות..."
            multiline
            minRows={3}
            inputProps={{ dir: "rtl" }}
          />
        </div>
      </div>

      {/* ─── 4. PAYMENT BOX ─────────────────────────────────────────────── */}
      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>
          <PaymentsOutlinedIcon className={classes.sectionIcon} />
          פרטי תשלום
        </Typography>
        <div className={classes.paymentBox}>
          <Typography className={classes.paymentTitle}>אמצעי תשלום</Typography>

          {/* Method checkboxes — show all options, check the chosen one. */}
          <div className={classes.paymentMethodRow}>
            {PAYMENT_METHODS.map((method) => {
              const checked = method === selectedMethod;
              return (
                <div
                  key={method}
                  className={`${classes.paymentMethodOption} ${checked ? classes.paymentMethodOptionChecked : ""}`}
                >
                  <span className={`${classes.paymentCheckbox} ${checked ? classes.paymentCheckboxChecked : ""}`}>
                    {checked && <CheckIcon style={{ fontSize: "14px" }} />}
                  </span>
                  <span>{method}</span>
                </div>
              );
            })}
          </div>

          <div className={classes.paymentDetailsGrid}>
            <div className={classes.paymentDetailCell}>
              <Typography className={classes.paymentDetailLabel}>מספר תשלומים</Typography>
              <Typography className={classes.paymentDetailValue}>{fmtOrDash(fd.numPayments)}</Typography>
            </div>
            <div className={classes.paymentDetailCell}>
              <Typography className={classes.paymentDetailLabel}>סכום עסקה</Typography>
              <Typography className={classes.paymentDetailValue}>{fmtMoney(fd.totalAmount)}</Typography>
            </div>
          </div>

          <Typography className={classes.paymentDisclaimer}>
            על עסקאות באשראי תחול עמלה בסך של 2%.
          </Typography>
          <Typography className={classes.paymentDisclaimer}>
            המחירים אינם כוללים: טיולים, ביטוחים, טיפים בסך 25 יורו לאדם.
          </Typography>
        </div>
      </div>

      {/* ─── 5. TERMS (all 5 sections, fully expanded) ──────────────────── */}
      <div className={classes.section}>
        <Typography className={classes.sectionTitle}>
          <GavelOutlinedIcon className={classes.sectionIcon} />
          תנאים והסכמות
        </Typography>
        <div className={classes.termsList}>
          {TERMS_SECTIONS.map((s) => {
            // Mirror pdfGenerator.js: {{vacationName}} is the only placeholder
            // in the static terms today; "הנופש" fallback keeps the sentence
            // clean if the vacation name is missing.
            const termsVacName = pageData?.vacationName || 'הנופש';
            const body = s.body.split('{{vacationName}}').join(termsVacName);
            return (
              <div key={s.title} className={classes.termsSection}>
                <Typography className={classes.termsSectionTitle}>{s.title}</Typography>
                <Typography className={classes.termsSectionBody}>{body}</Typography>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── 6. SIGNATURE ───────────────────────────────────────────────── */}
      <div className={classes.section}>
        <div className={classes.signatureSection}>
          <Typography className={classes.signatureLabel}>
            <GestureIcon style={{ fontSize: "18px" }} />
            חתימת המזמין
          </Typography>
          <div className={classes.canvasWrapper}>
            <canvas
              ref={canvasRef}
              width={800}
              height={260}
              className={classes.canvas}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
            {canvasEmpty && <div className={classes.canvasHint}>חתמו כאן באצבע</div>}
          </div>
          <div className={classes.clearRow}>
            <Button className={classes.clearButton} onClick={clearCanvas}>נקה חתימה</Button>
          </div>
        </div>
      </div>

      {/* ─── 7. CONSENT + SUBMIT ────────────────────────────────────────── */}
      <Typography className={classes.consentText}>
        <LocalOfferOutlinedIcon style={{ fontSize: "14px", verticalAlign: "middle", marginLeft: "4px", color: "#0d9488" }} />
        בחתימה על טופס זה הריני מאשר/ת את התנאים לעיל ומסכים/ה לשלם את הסכום שסוכם.
      </Typography>
      <Button
        className={classes.submitButton}
        onClick={handleSubmit}
        disabled={submitting || canvasEmpty}
      >
        {submitting ? "שולח..." : "אישור ושליחת הטופס"}
      </Button>
      {submitError && (
        <Typography className={classes.submitError}>{submitError}</Typography>
      )}
    </>
  );
}

export default RegistrationScreenView;
