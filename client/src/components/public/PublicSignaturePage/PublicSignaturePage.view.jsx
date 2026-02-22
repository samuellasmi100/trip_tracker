import React from "react";
import { Typography, TextField, Button, InputLabel, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GestureIcon from "@mui/icons-material/Gesture";
import { useStyles } from "./PublicSignaturePage.style";

function PublicSignaturePageView({
  pageData,
  loading,
  error,
  signerName,
  setSignerName,
  submitting,
  submitted,
  canvasRef,
  canvasEmpty,
  startDraw,
  draw,
  stopDraw,
  clearCanvas,
  handleSubmit,
}) {
  const classes = useStyles();

  const LogoArea = () => (
    <div className={classes.logoArea}>
      <Typography className={classes.brandName}>Avimor Tourism</Typography>
      <Typography className={classes.brandSub}>אביאל מור טיורים</Typography>
      <div className={classes.divider} />
    </div>
  );

  if (loading) {
    return (
      <div className={classes.page}>
        <div className={classes.card}>
          <LogoArea />
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <CircularProgress style={{ color: "#0d9488" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.page}>
        <div className={classes.card}>
          <LogoArea />
          <Typography className={classes.errorText}>{error}</Typography>
        </div>
      </div>
    );
  }

  if (!pageData) return null;

  if (pageData.alreadySigned) {
    return (
      <div className={classes.page}>
        <div className={classes.card}>
          <LogoArea />
          <div className={classes.successCard}>
            <CheckCircleOutlineIcon className={classes.successIcon} />
            <Typography className={classes.successTitle}>החתימה התקבלה!</Typography>
            <Typography className={classes.successText}>
              משפחת {pageData.familyName} כבר חתמה על ההסכם.
              {pageData.signerName && (
                <>
                  <br />
                  חתם: {pageData.signerName}
                </>
              )}
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={classes.page}>
        <div className={classes.card}>
          <LogoArea />
          <div className={classes.successCard}>
            <CheckCircleOutlineIcon className={classes.successIcon} />
            <Typography className={classes.successTitle}>החתימה נשלחה בהצלחה!</Typography>
            <Typography className={classes.successText}>
              תודה, {signerName}!
              <br />
              חתימתכם על הסכם ההזמנה התקבלה.
            </Typography>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <LogoArea />

        <Typography className={classes.title}>הסכם הזמנה</Typography>
        <Typography className={classes.subtitle}>משפחת {pageData.familyName}</Typography>

        {pageData.agreementText && (
          <div className={classes.agreementBox}>
            <Typography className={classes.agreementText}>
              {pageData.agreementText}
            </Typography>
          </div>
        )}

        <div className={classes.fieldItem}>
          <InputLabel className={classes.label}>
            שם מלא <span className={classes.required}>*</span>
          </InputLabel>
          <TextField
            className={classes.textField}
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            size="small"
            placeholder="שם החותם"
            inputProps={{ dir: "rtl" }}
          />
        </div>

        <div className={classes.canvasSection}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
            <GestureIcon style={{ fontSize: "16px", color: "#64748b" }} />
            <InputLabel className={classes.label}>חתימה</InputLabel>
          </div>
          <div className={classes.canvasWrapper}>
            <canvas
              ref={canvasRef}
              width={400}
              height={180}
              className={classes.canvas}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
            {canvasEmpty && (
              <div className={classes.canvasHint}>חתמו כאן</div>
            )}
          </div>
          <div style={{ textAlign: "right", marginTop: "6px" }}>
            <Button className={classes.clearButton} onClick={clearCanvas}>
              נקה
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={submitting || !signerName.trim() || canvasEmpty}
          className={classes.submitButton}
        >
          {submitting ? "שולח..." : "שלח חתימה"}
        </Button>

        <Typography className={classes.footer}>
          חתימתכם מהווה אישור לתנאי ההסכם
        </Typography>
      </div>
    </div>
  );
}

export default PublicSignaturePageView;
