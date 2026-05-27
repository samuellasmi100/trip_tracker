import React from "react";
import {
  Dialog, DialogTitle, DialogContent, IconButton, Tooltip,
  Typography, TextField, InputLabel, Button, CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useStyles } from "./ShareDocumentDialog.style";

function ShareDocumentDialogView({
  open, onClose,
  recipient, onRecipientChange,
  whatsappHref, whatsappEnabled,
  emailHref, emailEnabled,
  onCopy, copied, copyEnabled,
  loading, error,
}) {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.paper }} style={{ zIndex: 1700 }}>
      <DialogTitle className={classes.title}>
        <span>שיתוף טופס חתום</span>
        <Tooltip title="סגור">
          <IconButton className={classes.closeBtn} onClick={onClose} size="small">
            <CloseIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent className={classes.body}>
        <InputLabel className={classes.fieldLabel}>טלפון או אימייל של הנמען</InputLabel>
        <TextField
          className={classes.textField}
          value={recipient}
          onChange={(e) => onRecipientChange(e.target.value)}
          size="small"
          fullWidth
          placeholder="054-4372393  או  someone@example.com"
          inputProps={{ dir: "rtl" }}
          disabled={loading}
        />
        <Typography className={classes.caption}>
          הקישור בתוקף ל-7 ימים
        </Typography>

        {loading && (
          <div className={classes.loadingText}>
            <CircularProgress size={20} style={{ color: "#0d9488", marginLeft: 6 }} />
            יוצר קישור בתוקף 7 ימים...
          </div>
        )}
        {error && (
          <Typography className={classes.errorText}>{error}</Typography>
        )}

        <div className={classes.buttonStack}>
          <Button
            className={`${classes.channelButton} ${classes.whatsappButton}`}
            disabled={!whatsappEnabled}
            onClick={() => window.open(whatsappHref, "_blank", "noopener")}
          >
            <WhatsAppIcon /> WhatsApp
          </Button>
          <Button
            className={`${classes.channelButton} ${classes.emailButton}`}
            disabled={!emailEnabled}
            onClick={() => { window.location.href = emailHref; }}
          >
            <MailOutlineIcon /> שליחה באימייל
          </Button>
          <Button
            className={`${classes.channelButton} ${classes.copyButton}`}
            disabled={!copyEnabled}
            onClick={onCopy}
          >
            {copied ? <CheckIcon style={{ color: "#22c55e" }} /> : <ContentCopyIcon />}
            {copied ? "הועתק!" : "העתקת קישור"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDocumentDialogView;
