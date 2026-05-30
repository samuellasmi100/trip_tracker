import React from "react";
import {
  Typography, TextField, Button, CircularProgress, LinearProgress, IconButton, Tooltip,
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
// Page chrome is shared with the registration public page so the two look
// identical; only the upload grid uses this component's own styles.
import { useStyles as useShellStyles } from "../PublicRegistration/PublicLinkShell.style";
import { useStyles as useDocStyles } from "./PublicDocumentUpload.style";
import logoUrl from "../../../assets/icons/avimor-logo.png";

const SIGNED_REGISTRATION_KEY = "signed_registration";
const FLIGHT_TICKET_KEY = "flight_ticket";

const fullName = (m) => `${m.hebrew_first_name || ""} ${m.hebrew_last_name || ""}`.trim();
// Independent fliers (flying_with_us=0) additionally need a flight ticket — the
// INVERSE of the flight-data completeness rule, matching the server.
const isIndependent = (m) => Number(m.flying_with_us) === 0;

function PublicDocumentUploadView({
  loading, fatal, info,
  last4, verifying, verifyError, verified, onLast4Change, onVerify,
  family, members, docTypes, uploadedDocs,
  staged = {}, saving, saveError, saveSuccess,
  busyKey, slotError, onStage, onUnstage, onPreviewStaged, onSave, onView, onDelete,
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

  // Required, per-guest types (matches the server X/Y rule): every required type
  // except the family-level signed registration; flight_ticket only shows for
  // independent fliers.
  const perGuestTypes = (docTypes || []).filter(
    (t) => t.type_key !== SIGNED_REGISTRATION_KEY && Number(t.is_required) === 1
  );
  const slotsFor = (m) =>
    perGuestTypes.filter((t) => t.type_key !== FLIGHT_TICKET_KEY || isIndependent(m));

  let total = 0;
  let done = 0;
  members.forEach((m) => slotsFor(m).forEach((t) => {
    total += 1;
    if (uploadedMap.has(`${m.user_id}-${t.id}`)) done += 1;
  }));
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const allDone = total > 0 && done >= total;
  const stagedCount = Object.keys(staged).length;

  return (
    <Frame>
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
                <Typography className={c.guestName}>{fullName(m) || "אורח"}</Typography>
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
