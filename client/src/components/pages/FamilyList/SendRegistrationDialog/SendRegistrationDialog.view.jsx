import React from "react";
import {
  Dialog, DialogTitle, DialogContent, IconButton, Tooltip,
  Typography, Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { useStyles } from "./SendRegistrationDialog.style";

function SendRegistrationDialogView({
  open, onClose,
  link, headFirstName, vacationName, expiresAtFormatted,
  whatsappHref,
  emailHref,
  emailDisabledReason,
  onCopy, copied,
}) {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.paper }} style={{ zIndex: 1650 }}>
      <DialogTitle className={classes.title}>
        <span>שליחת קישור לטופס רישום</span>
        <Tooltip title="סגור">
          <IconButton className={classes.closeBtn} onClick={onClose} size="small">
            <CloseIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent className={classes.body}>
        <div className={classes.summaryCard}>
          <div className={classes.summaryRow}>
            <span className={classes.summaryLabel}>נמען</span>
            <span className={classes.summaryValue} style={{ direction: "rtl" }}>
              {headFirstName || "—"}
            </span>
          </div>
          <div className={classes.summaryRow}>
            <span className={classes.summaryLabel}>חופשה</span>
            <span className={classes.summaryValue} style={{ direction: "rtl" }}>
              {vacationName || "—"}
            </span>
          </div>
          <div className={classes.summaryRow}>
            <span className={classes.summaryLabel}>בתוקף עד</span>
            <span className={classes.summaryValue}>{expiresAtFormatted}</span>
          </div>
          <div className={classes.linkPreview}>{link}</div>
        </div>

        <div className={classes.buttonStack}>
          <Button
            className={`${classes.channelButton} ${classes.whatsappButton}`}
            onClick={() => window.open(whatsappHref, "_blank", "noopener")}
          >
            <WhatsAppIcon /> WhatsApp
          </Button>

          <Tooltip title={emailDisabledReason || ""}>
            {/* span wrapper so Tooltip works on a disabled Button */}
            <span>
              <Button
                className={`${classes.channelButton} ${classes.emailButton}`}
                disabled={!!emailDisabledReason}
                onClick={() => { window.location.href = emailHref; }}
                style={{ width: "100%" }}
              >
                <MailOutlineIcon /> שליחה באימייל
              </Button>
            </span>
          </Tooltip>

          <Button
            className={`${classes.channelButton} ${classes.copyButton}`}
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

export default SendRegistrationDialogView;
