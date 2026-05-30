import React, { useMemo, useState, useCallback } from "react";
import SendDocumentLinkDialogView from "./SendDocumentLinkDialog.view";

// Container: builds the message body + channel URLs from the props, owns the
// "copied" flash state. Mirrors SendRegistrationDialog, but the document link is
// permanent (no expiry line) and the copy is document-flavored. Presentation
// lives in SendDocumentLinkDialog.view (reusing the registration dialog styles).
const SendDocumentLinkDialog = ({
  open, onClose,
  link,            // full URL (already prefixed with window.location.origin upstream)
  headFirstName,   // greeting line in the message body
  headPhone,       // wa.me-ready digit string (no "+")
  headEmail,       // string or null
  vacationName,    // message body + subject line
}) => {
  // URL isolated by blank lines on both sides for WhatsApp's RTL linkifier —
  // same layout the registration message uses.
  const messageBody = useMemo(() => (
    `שלום ${headFirstName || ""},\n` +
    `לפניך קישור להעלאת המסמכים הנדרשים לחופשת ${vacationName || ""}.\n` +
    `ניתן להעלות מסמכים ולחזור לקישור בכל עת.\n` +
    `\n` +
    `${link}\n` +
    `\n` +
    `תודה!`
  ), [headFirstName, vacationName, link]);

  const whatsappHref = useMemo(
    () => `https://wa.me/${headPhone || ''}?text=${encodeURIComponent(messageBody)}`,
    [headPhone, messageBody]
  );

  const emailHref = useMemo(() => {
    if (!headEmail) return "";
    const subject = `העלאת מסמכים לחופשת ${vacationName || ""}`;
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
      console.warn("clipboard write failed:", e);
    }
  }, [link]);

  return (
    <SendDocumentLinkDialogView
      open={open}
      onClose={onClose}
      link={link}
      headFirstName={headFirstName}
      vacationName={vacationName}
      whatsappHref={whatsappHref}
      emailHref={emailHref}
      emailDisabledReason={emailDisabledReason}
      onCopy={handleCopy}
      copied={copied}
    />
  );
};

export default SendDocumentLinkDialog;
