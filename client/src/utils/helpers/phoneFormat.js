/**
 * Phone-number helpers for outbound channels (WhatsApp, mailto-tel, etc.).
 *
 * Used by two callers today (SendRegistrationDialog, ShareDocumentDialog),
 * which is why this lives in utils/helpers — the rule is one helper per
 * "second caller" per client/CLAUDE.md.
 */

/**
 * Convert a raw phone string (concatenated phone_a + phone_b, or freeform
 * user input) into the digits-only international form wa.me expects.
 *
 * Rules (in order):
 *   1. Leading "+"      → already international. Strip all non-digits and
 *                          pass through. e.g. "+447700900000" → "447700900000".
 *                          Also covers legacy operator prefixes like
 *                          "+1081…" — wa.me may reject those, but that's a
 *                          data-quality issue we don't second-guess here.
 *   2. Leading "0"      → Israeli local. Strip non-digits, then replace the
 *                          leading "0" with "972".
 *                          e.g. "054-4372393" → "0544372393" → "972544372393".
 *   3. Anything else    → defensive fallback. Strip non-digits and return.
 *
 * Returns "" when the input has no digits at all.
 */
export const toWhatsAppDigits = (raw) => {
  const s = String(raw || '').trim();
  if (!s) return '';

  // Rule 1: international prefix declared by the user.
  if (s.startsWith('+')) {
    return s.replace(/\D/g, '');
  }

  // Strip non-digits to inspect what we're left with.
  const digits = s.replace(/\D/g, '');
  if (!digits) return '';

  // Rule 2: Israeli local form (leading zero).
  if (digits.startsWith('0')) {
    return '972' + digits.slice(1);
  }

  // Rule 3: fallback — already in some other shape, return digits.
  return digits;
};

/**
 * Derive an E.164 string ("+972…") from the legacy phone_a/phone_b column
 * pair. Mirrors the server's utils/phoneNormalize.buildWhatsAppDigits shape
 * detection so the GuestEditor can prefill the unified phone input for rows
 * that haven't been backfilled yet. Returns "" when there are no digits.
 *
 * Kept in lockstep with the server logic; if one changes, change both.
 */
export const legacyPartsToE164 = (phoneA, phoneB) => {
  const a = String(phoneA || '').trim();
  const b = String(phoneB || '').trim();
  const aDigits = a.replace(/\D/g, '');
  const bDigits = b.replace(/\D/g, '');

  // International country code declared in phone_a (e.g. "+44").
  if (a.startsWith('+')) {
    const digits = (bDigits.length > 0 && bDigits.startsWith(aDigits)) ? bDigits : aDigits + bDigits;
    return digits ? `+${digits}` : '';
  }

  // Israeli local form: phone_b may be the full number or just the local part.
  let combined;
  if (bDigits.length >= 9 && bDigits.startsWith('0')) {
    combined = bDigits;
  } else if (bDigits.length > 0) {
    combined = aDigits + bDigits;
  } else {
    combined = aDigits;
  }
  if (!combined) return '';
  if (combined.startsWith('0')) return `+972${combined.slice(1)}`;
  return `+${combined}`;
};

/**
 * Cheap "looks like an email" check for the share-recipient input — used to
 * decide whether to enable the WhatsApp button or the Email button. Not RFC
 * 5322; deliberately permissive ("foo@bar" passes) because the recipient is
 * editable and the worst case is a mailto: URL that opens an email client
 * which then validates properly.
 */
export const looksLikeEmail = (s) => /@/.test(String(s || ''));
