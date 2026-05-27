import React, { useState, useEffect, useCallback } from "react";
import {
  Typography, TextField, Button, CircularProgress,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ApiRegistrations from "../../../apis/registrationsRequest";
import { useStyles } from "./PublicLinkShell.style";
import logoUrl from "../../../assets/icons/avimor-logo.png";

/**
 * Reusable shell for public token-gated pages.
 *
 * Owns the loading / error / expired / already-signed states and the phone
 * last-4 verification gate. When verified, renders `children({ pageData,
 * verifyToken })` so the caller can render its specific content (registration
 * form, future passport upload, etc.) without re-implementing the gate.
 *
 * Props:
 *   - vacationId, token: from the URL
 *   - children: render-prop receiving { pageData, verifyToken }
 *
 * Currently registration-specific (hits /public/register/...). When the
 * passport-upload flow lands, we can either:
 *   (a) parameterise the api object via prop, or
 *   (b) duplicate the shell — it's small enough.
 * Deferred until that feature is real.
 */
const PublicLinkShell = ({ vacationId, token, children }) => {
  const classes = useStyles();

  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState(null);
  const [fatal, setFatal] = useState(null);          // { code, message } if unrecoverable

  const [last4, setLast4] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(null);
  const [verifyToken, setVerifyToken] = useState(null);
  // The verify endpoint returns the post-verify form data (full phone,
  // email, stay dates, payment fields). Held here and passed through to
  // children so the registration page can render the read-only orderer
  // block and payment box without an extra fetch.
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await ApiRegistrations.getPublicPage(vacationId, token);
        if (!cancelled) setPageData(res.data);
      } catch (e) {
        if (cancelled) return;
        const code = e?.response?.data?.code;
        const message = e?.response?.data?.message;
        setFatal({
          code: code || "UNKNOWN",
          message: message || "קישור לא תקין או שפג תוקפו",
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [vacationId, token]);

  const handleLast4Change = useCallback((e) => {
    const v = e.target.value.replace(/\D/g, "").slice(0, 4);
    setLast4(v);
    if (verifyError) setVerifyError(null);
  }, [verifyError]);

  const handleVerify = useCallback(async () => {
    if (last4.length !== 4) {
      setVerifyError("יש להזין בדיוק 4 ספרות");
      return;
    }
    setVerifying(true);
    setVerifyError(null);
    try {
      const res = await ApiRegistrations.verifyPhone(vacationId, token, last4);
      setVerifyToken(res.data.verifyToken);
      setFormData(res.data.formData || null);
    } catch (e) {
      const code = e?.response?.data?.code;
      const message = e?.response?.data?.message;
      if (code === "RATE_LIMITED") {
        setVerifyError(message || "יותר מדי ניסיונות, נסה שוב מאוחר יותר");
      } else if (code === "WRONG_PHONE") {
        setVerifyError("4 הספרות אינן תואמות, נסה שוב");
      } else if (code === "EXPIRED" || code === "CANCELLED" || code === "ALREADY_SIGNED") {
        // Token state changed under our feet — escalate to fatal.
        setFatal({ code, message: message || "הקישור אינו תקף יותר" });
      } else {
        setVerifyError(message || "אימות נכשל, נסה שוב");
      }
    } finally {
      setVerifying(false);
    }
  }, [last4, vacationId, token]);

  // Hero is the same for every state (gives the page a stable, branded top).
  const Hero = () => (
    <div className={classes.hero}>
      <img src={logoUrl} alt="Avimor" className={classes.logo} />
      {pageData?.vacationName && (
        <>
          <Typography className={classes.vacationName}>
            {pageData.vacationName}
          </Typography>
          <Typography className={classes.vacationSub}>
            טופס הרשמה לחופשה
          </Typography>
        </>
      )}
      {!pageData?.vacationName && (
        <Typography className={classes.vacationName}>טופס הרשמה לחופשה</Typography>
      )}
    </div>
  );

  // ── States in order: loading → fatal → already-signed → verify gate → children
  if (loading) {
    return (
      <div className={classes.page}>
        <div className={classes.card}>
          <Hero />
          <div className={classes.body}>
            <div className={classes.stateBlock}>
              <CircularProgress style={{ color: "#0d9488" }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fatal) {
    return (
      <div className={classes.page}>
        <div className={classes.card}>
          <Hero />
          <div className={classes.body}>
            <div className={classes.stateBlock}>
              <ErrorOutlineIcon className={classes.stateIcon} style={{ color: "#dc2626" }} />
              <Typography className={classes.stateTitle}>הקישור לא תקף</Typography>
              <Typography className={classes.stateText}>{fatal.message}</Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (pageData?.alreadySigned) {
    return (
      <div className={classes.page}>
        <div className={classes.card}>
          <Hero />
          <div className={classes.body}>
            <div className={classes.stateBlock}>
              <CheckCircleOutlineIcon className={classes.stateIcon} style={{ color: "#0d9488" }} />
              <Typography className={classes.stateTitle}>הטופס כבר נחתם</Typography>
              <Typography className={classes.stateText}>
                {pageData.familyName ? `משפחת ${pageData.familyName} ` : ""}חתמה על הטופס.
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!verifyToken) {
    return (
      <div className={classes.page}>
        <div className={classes.card}>
          <Hero />
          <div className={classes.body}>
            <div className={classes.verifyIntro}>
              <LockOutlinedIcon style={{ fontSize: 36, color: "#0d9488", marginBottom: 4 }} />
              <Typography className={classes.verifyTitle}>אימות זהות</Typography>
              <Typography className={classes.verifyHint}>
                הזן את 4 הספרות האחרונות של מספר הטלפון{" "}
                <span className={classes.verifyHintStrong}>
                  ({pageData?.phoneHint || "****"})
                </span>
              </Typography>
            </div>
            <TextField
              fullWidth
              className={classes.verifyField}
              value={last4}
              onChange={handleLast4Change}
              inputProps={{ inputMode: "numeric", maxLength: 4, dir: "ltr" }}
              placeholder="0000"
              autoFocus
            />
            {verifyError && (
              <Typography className={classes.verifyError}>{verifyError}</Typography>
            )}
            <Button
              className={classes.verifyButton}
              onClick={handleVerify}
              disabled={verifying || last4.length !== 4}
            >
              {verifying ? "מאמת..." : "המשך"}
            </Button>
            <Typography className={classes.footer}>
              קישור מאובטח · אימות בעזרת מספר הטלפון
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  // Verified — hand off to the page-specific child.
  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <Hero />
        <div className={classes.body}>
          {children({ pageData, verifyToken, formData })}
        </div>
      </div>
    </div>
  );
};

export default PublicLinkShell;
