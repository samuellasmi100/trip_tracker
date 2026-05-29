import React, { useMemo, useState, useCallback } from "react";
import SendRegistrationDialogView from "./SendRegistrationDialog.view";

// Format an ISO datetime as DD/MM/YYYY HH:mm — matches the format the PDF
// generator uses for "בתוקף עד" and "נחתם:" so the coordinator sees the same
// shape everywhere. Returns "—" for falsy or invalid input.
const fmtDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} `
       + `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Container: builds the message body + channel URLs from the props, owns the
// "copied" flash state. The presentation lives in SendRegistrationDialog.view.
const SendRegistrationDialog = ({
  open, onClose,
  link,            // full URL (already prefixed with window.location.origin upstream)
  expiresAt,       // ISO datetime string from server
  headFirstName,   // for greeting line in the message body
  headPhone,       // ALREADY-normalized digit string from server (wa.me-ready, no "+")
  headEmail,       // string or null
  vacationName,    // for the message body + subject line
}) => {
  const expiresAtFormatted = fmtDateTime(expiresAt);

  // URL fully isolated by blank lines on BOTH sides — WhatsApp's RTL
  // linkifier is finicky and the URL-last layout alone wasn't enough.
  // A trailing closing line (after a blank) keeps the URL in its own
  // paragraph without trailing-edge punctuation interference.
  const messageBody = useMemo(() => (
    `שלום ${headFirstName || ""},\n` +
    `לפניך קישור לטופס רישום לחופשת ${vacationName || ""}.\n` +
    `הקישור בתוקף עד ${expiresAtFormatted}.\n` +
    `\n` +
    `${link}\n` +
    `\n` +
    `תודה!`
  ), [headFirstName, vacationName, link, expiresAtFormatted]);

  const whatsappHref = useMemo(
    // headPhone is pre-normalized server-side (buildWhatsAppDigits handles
    // the various phone_a/phone_b shapes that exist in production data).
    () => `https://wa.me/${headPhone || ''}?text=${encodeURIComponent(messageBody)}`,
    [headPhone, messageBody]
  );

  const emailHref = useMemo(() => {
    if (!headEmail) return "";
    const subject = `טופס רישום לחופשת ${vacationName || ""}`;
    return `mailto:${headEmail}`
      + `?subject=${encodeURIComponent(subject)}`
      + `&body=${encodeURIComponent(messageBody)}`;
  }, [headEmail, vacationName, messageBody]);

  const emailDisabledReason = headEmail ? "" : "אין כתובת אימייל לראש המשפחה";

  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      // Older browsers / insecure contexts may reject clipboard.write — fall
      // back to letting the user select the link in the preview manually.
      console.warn("clipboard write failed:", e);
    }
  }, [link]);

  return (
    <SendRegistrationDialogView
      open={open}
      onClose={onClose}
      link={link}
      headFirstName={headFirstName}
      vacationName={vacationName}
      expiresAtFormatted={expiresAtFormatted}
      whatsappHref={whatsappHref}
      emailHref={emailHref}
      emailDisabledReason={emailDisabledReason}
      onCopy={handleCopy}
      copied={copied}
    />
  );
};

export default SendRegistrationDialog;
