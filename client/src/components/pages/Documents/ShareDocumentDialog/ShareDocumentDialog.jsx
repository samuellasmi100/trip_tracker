import React, { useEffect, useMemo, useState, useCallback } from "react";
import ShareDocumentDialogView from "./ShareDocumentDialog.view";
import ApiDocuments from "../../../../apis/documentsRequest";
import { toWhatsAppDigits, looksLikeEmail } from "../../../../utils/helpers/phoneFormat";

// URL fully isolated by blank lines on BOTH sides — WhatsApp's RTL
// linkifier is finicky and one-sided isolation alone wasn't enough.
// Trailing closing line keeps the URL in its own paragraph.
const buildMessage = (url) =>
  `שלום,\n` +
  `מצורף טופס הרשמה חתום.\n` +
  `\n` +
  `${url}\n` +
  `\n` +
  `תודה!`;

const SUBJECT = "טופס הרשמה חתום";

const ShareDocumentDialog = ({ open, onClose, docId, vacationId, token }) => {
  const [recipient,   setRecipient]   = useState("");
  const [shareUrl,    setShareUrl]    = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [copied,      setCopied]      = useState(false);

  // Lazy-fetch a 7-day presigned URL when the dialog opens. We clear the
  // local state on close so re-opening from a different docId always starts
  // fresh (the user might share doc A, close, then share doc B without
  // reloading the page).
  useEffect(() => {
    if (!open || !docId || !vacationId || !token) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setShareUrl(null);
    ApiDocuments.getDownloadUrl(token, vacationId, docId, { share: true })
      .then((res) => {
        if (cancelled) return;
        setShareUrl(res?.data?.url || null);
      })
      .catch((e) => {
        if (cancelled) return;
        const msg = e?.response?.data?.message || "יצירת הקישור נכשלה, נסה שוב";
        setError(msg);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [open, docId, vacationId, token]);

  // Reset when the dialog closes so the next open re-fetches and clears
  // recipient input.
  useEffect(() => {
    if (open) return;
    setRecipient("");
    setShareUrl(null);
    setError(null);
    setCopied(false);
  }, [open]);

  // Mode detection — single input, auto-routed. Empty input means neither
  // channel works yet (copy is always fine once shareUrl is in).
  const isEmail   = looksLikeEmail(recipient);
  const phoneDigits = useMemo(
    () => (isEmail ? "" : toWhatsAppDigits(recipient)),
    [recipient, isEmail]
  );

  const messageBody = useMemo(() => buildMessage(shareUrl || ""), [shareUrl]);

  const whatsappHref = useMemo(
    () => `https://wa.me/${phoneDigits}?text=${encodeURIComponent(messageBody)}`,
    [phoneDigits, messageBody]
  );

  const emailHref = useMemo(() => {
    if (!isEmail || !recipient) return "";
    return `mailto:${recipient}`
      + `?subject=${encodeURIComponent(SUBJECT)}`
      + `&body=${encodeURIComponent(messageBody)}`;
  }, [isEmail, recipient, messageBody]);

  // Button enable rules: only one channel is meaningful at a time. Copy
  // works as soon as we have the URL — recipient input is optional for it.
  const ready          = !!shareUrl && !loading && !error;
  const whatsappEnabled = ready && !isEmail && phoneDigits.length >= 8;
  const emailEnabled    = ready &&  isEmail && /@.+\./.test(recipient);
  const copyEnabled     = ready;

  const handleCopy = useCallback(async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch (e) {
      console.warn("clipboard write failed:", e);
    }
  }, [shareUrl]);

  return (
    <ShareDocumentDialogView
      open={open}
      onClose={onClose}
      recipient={recipient}
      onRecipientChange={setRecipient}
      whatsappHref={whatsappHref}
      whatsappEnabled={whatsappEnabled}
      emailHref={emailHref}
      emailEnabled={emailEnabled}
      onCopy={handleCopy}
      copied={copied}
      copyEnabled={copyEnabled}
      loading={loading}
      error={error}
    />
  );
};

export default ShareDocumentDialog;
