import React, { useMemo, useState, useCallback } from "react";
import SendDocumentLinkDialogView from "./SendDocumentLinkDialog.view";

// Adding ?split=1 to the doc link doesn't change WHAT the head verifies/uploads;
// it only makes his page reveal per-surname links he can forward himself. The
// helper keeps the existing query-string (none today, but future-proof).
const withSplit = (url) => `${url}${url.includes("?") ? "&" : "?"}split=1`;

// Container: builds the message body + channel URLs from the props, owns the
// "copied" flash state and (for multi-surname families) the chosen link mode.
// Mirrors SendRegistrationDialog, but the document link is permanent (no expiry
// line). Presentation lives in SendDocumentLinkDialog.view.
const SendDocumentLinkDialog = ({
  open, onClose,
  link,            // full URL (already prefixed with window.location.origin upstream)
  headFirstName,   // greeting line in the message body
  headPhone,       // wa.me-ready digit string (no "+")
  headEmail,       // string or null
  vacationName,    // message body + subject line
  subgroups,       // [{ surname, count }] — distinct hebrew_last_name values under the family
}) => {
  // A family spanning >1 surname can either get one whole-family link or one
  // "split" link (same link + ?split=1) whose page lets the head forward
  // per-surname links. Either way the secretary sends ONE link to the head.
  const multiSurname = Array.isArray(subgroups) && subgroups.length > 1;

  // 'all' = whole-family link; 'split' = link whose page exposes the per-surname
  // links for the head to forward. Only meaningful when multiSurname.
  const [mode, setMode] = useState("all");
  const activeLink = multiSurname && mode === "split" ? withSplit(link) : link;

  // URL isolated by blank lines on both sides for WhatsApp's RTL linkifier —
  // same layout the registration message uses.
  const messageBody = useMemo(() => (
    `שלום ${headFirstName || ""},\n` +
    `לפניך קישור להעלאת המסמכים הנדרשים לחופשת ${vacationName || ""}.\n` +
    `ניתן להעלות מסמכים ולחזור לקישור בכל עת.\n` +
    `\n` +
    `${activeLink}\n` +
    `\n` +
    `תודה!`
  ), [headFirstName, vacationName, activeLink]);

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
      await navigator.clipboard.writeText(activeLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.warn("clipboard write failed:", e);
    }
  }, [activeLink]);

  return (
    <SendDocumentLinkDialogView
      open={open}
      onClose={onClose}
      link={activeLink}
      headFirstName={headFirstName}
      vacationName={vacationName}
      whatsappHref={whatsappHref}
      emailHref={emailHref}
      emailDisabledReason={emailDisabledReason}
      onCopy={handleCopy}
      copied={copied}
      multiSurname={multiSurname}
      mode={mode}
      onModeChange={setMode}
    />
  );
};

export default SendDocumentLinkDialog;
