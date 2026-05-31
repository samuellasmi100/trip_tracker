import React from "react";
import {
  Dialog, DialogTitle, DialogContent, IconButton, Tooltip, Button, Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import GroupsIcon from "@mui/icons-material/Groups";
import CallSplitIcon from "@mui/icons-material/CallSplit";
// Reuse the registration send-dialog styles verbatim so the two look identical.
import { useStyles } from "../SendRegistrationDialog/SendRegistrationDialog.style";
// Doc-only styles for the multi-surname mode selector.
import { useStyles as useChooserStyles } from "./SendDocumentLinkDialog.style";

// The two link modes a multi-surname family can be sent. Both deliver ONE link
// to the head; they differ only in what his page shows (forward links or not).
const MODE_OPTIONS = [
  {
    key: "all",
    icon: GroupsIcon,
    title: "קישור אחד עם כל האורחים",
    desc: "ראש המשפחה מעלה את המסמכים של כולם.",
  },
  {
    key: "split",
    icon: CallSplitIcon,
    title: "קישור אחד שמכיל קישורים לכל תת-משפחה",
    desc: "ראש המשפחה מקבל בדף שלו קישור נפרד לכל שם משפחה ומעביר אותם בעצמו.",
  },
];

function SendDocumentLinkDialogView({
  open, onClose,
  link, headFirstName, vacationName,
  whatsappHref,
  emailHref,
  emailDisabledReason,
  onCopy, copied,
  multiSurname, mode, onModeChange,
}) {
  const classes = useStyles();
  const ch = useChooserStyles();
  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ className: classes.paper }} style={{ zIndex: 1650 }}>
      <DialogTitle className={classes.title}>
        <span>שליחת קישור להעלאת מסמכים</span>
        <Tooltip title="סגור">
          <IconButton className={classes.closeBtn} onClick={onClose} size="small">
            <CloseIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent className={classes.body}>
        {/* Multiple surnames under one family → let the secretary choose which
            single link to send. The per-surname links themselves live on the
            head's page (he forwards them); she never sends them herself. */}
        {multiSurname && (
          <>
            <Typography className={ch.chooserLabel}>
              המשפחה כוללת כמה שמות משפחה — בחר/י איזה קישור לשלוח לראש המשפחה:
            </Typography>
            <div className={ch.optionList}>
              {MODE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const active = mode === opt.key;
                return (
                  <div
                    key={opt.key}
                    className={`${ch.option} ${active ? ch.optionActive : ""}`}
                    onClick={() => onModeChange(opt.key)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onModeChange(opt.key); }}
                  >
                    <div className={ch.optionTitle}>
                      <span className={`${ch.radioDot} ${active ? ch.radioDotActive : ""}`} />
                      <Icon style={{ fontSize: "18px", color: "#0d9488" }} />
                      <span>{opt.title}</span>
                    </div>
                    <div className={ch.optionDesc}>{opt.desc}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

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
          {/* No "בתוקף עד" row — the document link is permanent (per-family doc_token). */}
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

export default SendDocumentLinkDialogView;
