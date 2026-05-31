import React from "react";
import {
  Typography, TextField, Button, CircularProgress, LinearProgress, IconButton, Tooltip,
  Switch, FormControlLabel,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
// Page chrome is shared with the registration public page so the two look
// identical; only the upload grid uses this component's own styles.
import { useStyles as useShellStyles } from "../PublicRegistration/PublicLinkShell.style";
import { useStyles as useDocStyles } from "./PublicDocumentUpload.style";
import logoUrl from "../../../assets/icons/avimor-logo.png";
import {
  requiredFlightTicketTypeKeys,
  FLIGHT_TICKET_OUTBOUND_KEY,
  FLIGHT_TICKET_RETURN_KEY,
} from "../../../utils/helpers/flightTicketRequirement";

const SIGNED_REGISTRATION_KEY = "signed_registration";
// All flight-ticket type_keys (legacy single + the two per-direction types) are
// excluded from the generic per-guest base; tickets are added per guest via the
// shared requiredFlightTicketTypeKeys helper instead.
const FLIGHT_TICKET_TYPE_KEYS = new Set([
  "flight_ticket", FLIGHT_TICKET_OUTBOUND_KEY, FLIGHT_TICKET_RETURN_KEY,
]);

const fullName = (m) => `${m.hebrew_first_name || ""} ${m.hebrew_last_name || ""}`.trim();

function PublicDocumentUploadView({
  loading, fatal, info,
  last4, verifying, verifyError, verified, onLast4Change, onVerify,
  family, members, docTypes, uploadedDocs,
  staged = {}, saving, saveError, saveSuccess,
  busyKey, slotError, onStage, onUnstage, onPreviewStaged, onSave, onView, onDelete,
  forwardLinks = [], copiedForward, onCopyForward,
  splitActive, showAllGuests, onToggleShowAll,
}) {
  const shell = useShellStyles();
  const c = useDocStyles();

  const familyName = info?.familyName || family?.family_name || "";

  const Hero = () => (
    <div className={shell.hero}>
      <img src={logoUrl} alt="Avimor" className={shell.logo} />
      <Typography className={shell.vacationName}>
        {familyName ? `משפחת ${familyName}` : "העלאת מסמכים"}
      </Typography>
      <Typography className={shell.vacationSub}>העלאת מסמכים לחופשה</Typography>
    </div>
  );

  const Frame = ({ children }) => (
    <div className={shell.page}>
      <div className={shell.card}>
        <Hero />
        <div className={shell.body}>{children}</div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <Frame>
        <div className={shell.stateBlock}>
          <CircularProgress style={{ color: "#0d9488" }} />
        </div>
      </Frame>
    );
  }

  if (fatal) {
    return (
      <Frame>
        <div className={shell.stateBlock}>
          <ErrorOutlineIcon className={shell.stateIcon} style={{ color: "#dc2626" }} />
          <Typography className={shell.stateTitle}>הקישור לא תקף</Typography>
          <Typography className={shell.stateText}>{fatal.message}</Typography>
        </div>
      </Frame>
    );
  }

  // ── Verify gate (identical markup/styles to the registration page) ─────────
  if (!verified) {
    return (
      <Frame>
        <div className={shell.verifyIntro}>
          <LockOutlinedIcon style={{ fontSize: 36, color: "#0d9488", marginBottom: 4 }} />
          <Typography className={shell.verifyTitle}>אימות זהות</Typography>
          <Typography className={shell.verifyHint}>
            הזן את 4 הספרות האחרונות של מספר הטלפון
          </Typography>
        </div>
        <TextField
          fullWidth
          className={shell.verifyField}
          value={last4}
          onChange={onLast4Change}
          inputProps={{ inputMode: "numeric", maxLength: 4, dir: "ltr" }}
          placeholder="0000"
          autoFocus
          onKeyDown={(e) => { if (e.key === "Enter") onVerify(); }}
        />
        {verifyError && <Typography className={shell.verifyError}>{verifyError}</Typography>}
        <Button className={shell.verifyButton} onClick={onVerify} disabled={verifying || last4.length !== 4}>
          {verifying ? "מאמת..." : "המשך"}
        </Button>
        <Typography className={shell.footer}>
          קישור מאובטח · אימות בעזרת מספר הטלפון
        </Typography>
      </Frame>
    );
  }

  // ── Verified upload screen ─────────────────────────────────────────────────
  const uploadedMap = new Map();
  (uploadedDocs || []).forEach((d) => uploadedMap.set(`${d.user_id}-${Number(d.doc_type_id)}`, d));

  // Required per-guest base (matches the server X/Y rule): required types that are
  // neither the family-level signed registration nor any flight ticket.
  const perGuestBaseTypes = (docTypes || []).filter(
    (t) =>
      t.type_key !== SIGNED_REGISTRATION_KEY &&
      !FLIGHT_TICKET_TYPE_KEYS.has(t.type_key) &&
      Number(t.is_required) === 1
  );
  // type_key → doc-type row for the per-direction tickets (is_required=0).
  const ticketTypeByKey = new Map(
    (docTypes || []).filter((t) => FLIGHT_TICKET_TYPE_KEYS.has(t.type_key)).map((t) => [t.type_key, t])
  );
  // Per-guest slots = base + the 0/1/2 flight tickets the helper says they need.
  const slotsFor = (m) => {
    const tickets = requiredFlightTicketTypeKeys(m)
      .map((key) => ticketTypeByKey.get(key))
      .filter(Boolean);
    return [...perGuestBaseTypes, ...tickets];
  };

  let total = 0;
  let done = 0;
  members.forEach((m) => slotsFor(m).forEach((t) => {
    total += 1;
    if (uploadedMap.has(`${m.user_id}-${t.id}`)) done += 1;
  }));
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done >= total;
  const stagedCount = Object.keys(staged).length;

  const hasForward = forwardLinks.length > 0;

  return (
    <Frame>
      {/* Split-mode: links the head forwards to each surname's people. Kept
          visually separate from the upload area below so "forward to others"
          never gets confused with "upload my own files". */}
      {hasForward && (
        <div className={c.forwardPanel}>
          <Typography className={c.forwardTitle}>
            <ShareOutlinedIcon style={{ fontSize: "20px", color: "#0d9488" }} />
            קישורים להעברה לבני המשפחה
          </Typography>
          <Typography className={c.forwardHint}>
            המשפחה כוללת כמה שמות משפחה. העבירו לכל קבוצה את הקישור שלה — כל קישור מציג
            רק את בני אותו שם משפחה. האימות נשאר 4 הספרות של מספר הטלפון שלך.
          </Typography>
          <div className={c.forwardList}>
            {forwardLinks.map((sg) => (
              <div key={sg.surname} className={c.forwardRow}>
                <div className={c.forwardHeader}>
                  <span className={c.forwardName} style={{ direction: "rtl" }}>{sg.surname}</span>
                  <span className={c.forwardCount}>{sg.count} נופשים</span>
                </div>
                <div className={c.forwardActions}>
                  <Button
                    className={`${c.forwardBtn} ${c.forwardWhatsapp}`}
                    onClick={() => window.open(sg.whatsappHref, "_blank", "noopener")}
                  >
                    <WhatsAppIcon style={{ fontSize: "18px" }} /> שיתוף
                  </Button>
                  <Button
                    className={`${c.forwardBtn} ${c.forwardCopy}`}
                    onClick={() => onCopyForward(sg.surname, sg.link)}
                  >
                    {copiedForward === sg.surname
                      ? <CheckIcon style={{ fontSize: "18px", color: "#22c55e" }} />
                      : <ContentCopyIcon style={{ fontSize: "18px" }} />}
                    {copiedForward === sg.surname ? "הועתק!" : "העתקה"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Split mode: head's grid defaults to his own subgroup; the toggle reveals
          the whole family so he CAN upload for others if he chooses. */}
      {splitActive && (
        <div className={c.uploadBar}>
          <Typography className={c.uploadHeading}>
            {showAllGuests ? "העלאת מסמכים — כל המשפחה" : "העלאת המסמכים שלי"}
          </Typography>
          <FormControlLabel
            className={c.showAllToggle}
            control={(
              <Switch
                size="small"
                checked={!!showAllGuests}
                onChange={(e) => onToggleShowAll(e.target.checked)}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#0d9488" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#0d9488" },
                }}
              />
            )}
            label="הצג את כל המשפחה"
          />
        </div>
      )}

      <Typography className={c.intro}>
        אנא העלו את המסמכים הנדרשים עבור כל אחד מבני המשפחה.<br />
        ניתן לשמור ולחזור בכל עת — מה שהועלה יישמר.
      </Typography>

      {allDone ? (
        <div className={c.successBlock}>
          <CheckCircleOutlineIcon className={c.successIcon} />
          <Typography className={c.successText}>כל המסמכים הנדרשים הועלו — תודה!</Typography>
        </div>
      ) : (
        <div className={c.progressWrap}>
          <Typography className={c.progressLabel}>
            <span>התקדמות</span>
            <span>{done} / {total}</span>
          </Typography>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "#e2e8f0",
              "& .MuiLinearProgress-bar": {
                backgroundColor: pct === 100 ? "#22c55e" : "#0d9488",
                borderRadius: 4,
              },
            }}
          />
        </div>
      )}

      <div className={c.guestGrid}>
        {members.map((m) => {
          const slots = slotsFor(m);
          const guestDone = slots.filter((t) => uploadedMap.has(`${m.user_id}-${t.id}`)).length;
          return (
            <div key={m.user_id} className={c.guestCard}>
              <div className={c.guestHeader}>
                <PersonOutlineIcon className={c.guestIcon} />
                <Typography className={c.guestName} title={fullName(m) || "אורח"}>
                  {fullName(m) || "אורח"}
                </Typography>
                <span className={c.guestCount}>{guestDone}/{slots.length}</span>
              </div>

              <div className={c.slotList}>
                {slots.map((t) => {
                  const key = `${m.user_id}-${t.id}`;
                  const doc = uploadedMap.get(key);
                  const isUploaded = !!doc;
                  const stagedEntry = staged[key];
                  const isStaged = !!stagedEntry;
                  const busy = busyKey === key;
                  const err = slotError?.key === key ? slotError.message : null;
                  const inputId = `doc-${key}`;

                  // Staged (pending save) takes visual precedence over saved.
                  const slotClass = isStaged ? c.slotStaged : isUploaded ? c.slotDone : "";

                  return (
                    <div key={t.id} className={`${c.slot} ${slotClass}`}>
                      <div className={c.slotMain}>
                        {isStaged
                          ? <PendingOutlinedIcon className={c.slotIconStaged} />
                          : isUploaded
                            ? <CheckCircleIcon className={c.slotIconDone} />
                            : <RadioButtonUncheckedIcon className={c.slotIconMissing} />}
                        <div className={c.slotText}>
                          <Typography className={c.slotLabel}>{t.label}</Typography>
                          {isStaged ? (
                            <>
                              <Typography className={c.slotPending}>ממתין לשמירה</Typography>
                              <Typography className={c.slotFile} title={stagedEntry.name}>{stagedEntry.name}</Typography>
                            </>
                          ) : isUploaded && doc.file_name ? (
                            <Typography className={c.slotFile} title={doc.file_name}>{doc.file_name}</Typography>
                          ) : !err ? (
                            <Typography className={c.slotHint}>טרם הועלה</Typography>
                          ) : null}
                          {err && <Typography className={c.slotErr}>{err}</Typography>}
                        </div>
                      </div>

                      <div className={c.slotActions}>
                        {busy ? (
                          <CircularProgress size={20} style={{ color: "#0d9488" }} />
                        ) : (
                          <>
                            <input
                              type="file"
                              id={inputId}
                              accept=".pdf,.jpg,.jpeg,.png"
                              style={{ display: "none" }}
                              disabled={saving}
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) onStage(m.user_id, t.id, f, key);
                                e.target.value = "";
                              }}
                            />
                            {isStaged ? (
                              <>
                                <Tooltip title="תצוגה מקדימה">
                                  <IconButton size="small" className={c.actionBtn} onClick={() => onPreviewStaged(key)} disabled={saving}>
                                    <VisibilityIcon style={{ fontSize: "20px" }} />
                                  </IconButton>
                                </Tooltip>
                                <label htmlFor={inputId}>
                                  <Tooltip title="החלפת הבחירה">
                                    <IconButton component="span" size="small" className={c.actionBtn} disabled={saving}>
                                      <AutorenewIcon style={{ fontSize: "20px" }} />
                                    </IconButton>
                                  </Tooltip>
                                </label>
                                <Tooltip title="ביטול הבחירה">
                                  <IconButton size="small" className={c.deleteBtn} onClick={() => onUnstage(key)} disabled={saving}>
                                    <CloseIcon style={{ fontSize: "20px" }} />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : isUploaded ? (
                              <>
                                {doc.id && (
                                  <Tooltip title="צפייה בקובץ">
                                    <IconButton size="small" className={c.actionBtn} onClick={() => onView(doc, key)}>
                                      <VisibilityIcon style={{ fontSize: "20px" }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <label htmlFor={inputId}>
                                  <Tooltip title="החלפת הקובץ">
                                    <IconButton component="span" size="small" className={c.actionBtn} disabled={saving}>
                                      <AutorenewIcon style={{ fontSize: "20px" }} />
                                    </IconButton>
                                  </Tooltip>
                                </label>
                                {doc.id && (
                                  <Tooltip title="מחיקה">
                                    <IconButton size="small" className={c.deleteBtn} onClick={() => onDelete(doc, key)} disabled={saving}>
                                      <DeleteOutlineIcon style={{ fontSize: "20px" }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                              </>
                            ) : (
                              <label htmlFor={inputId}>
                                <Button
                                  component="span"
                                  size="small"
                                  className={c.uploadBtn}
                                  startIcon={<CloudUploadOutlinedIcon />}
                                  disabled={saving}
                                >
                                  בחירת קובץ
                                </Button>
                              </label>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className={c.saveBar}>
        {saveSuccess && stagedCount === 0 && (
          <Typography className={c.saveMsgOk}>הקבצים הועלו בהצלחה</Typography>
        )}
        {saveError && <Typography className={c.saveMsgErr}>{saveError}</Typography>}
        <Button
          className={c.saveButton}
          onClick={onSave}
          disabled={saving || stagedCount === 0}
        >
          {saving ? "שומר..." : stagedCount > 0 ? `שמירה (${stagedCount})` : "שמירה"}
        </Button>
        <Typography className={shell.footer}>
          הקבצים נשמרים באופן מאובטח · ניתן להעלות PDF, JPG, PNG עד 10MB
        </Typography>
      </div>
    </Frame>
  );
}

export default PublicDocumentUploadView;
