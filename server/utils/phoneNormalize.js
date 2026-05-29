'use strict';

/**
 * phoneNormalize.js — single source of truth for collapsing the legacy
 * phone_a/phone_b column pair into one canonical number.
 *
 * Second-caller rule: this used to live privately inside registrationsService
 * (`buildWhatsAppDigits`). It's promoted here now that the phone-column
 * migration backfill (scripts/backfill_phone_e164.js) needs the exact same
 * shape-detection logic to produce the new `guest.phone` column. Keep both
 * callers on this one implementation so the WhatsApp link and the stored E.164
 * value can never diverge.
 *
 * The dual-column storage was never used consistently across the app:
 *   • Excel imports populate phone_a as the FULL number, phone_b = NULL.
 *   • The GuestEditor form treats phone_a as the area-code Select and phone_b
 *     as the local part — but users sometimes type the full number into
 *     phone_b too, leaving doubled area codes on save.
 *   • Other UI sites display phone_a alone as "the phone".
 * buildWhatsAppDigits detects every observed shape and produces one correct
 * international digit string (country code first, no "+").
 */

// Resolve phone_a + phone_b into a wa.me-ready digit string (no "+", country
// code first). Returns '' when there are no digits at all.
const buildWhatsAppDigits = (phoneA, phoneB) => {
  const a = String(phoneA || '').trim();
  const b = String(phoneB || '').trim();
  const aDigits = a.replace(/\D/g, '');
  const bDigits = b.replace(/\D/g, '');

  // International country code declared in phone_a (e.g. "+44", legacy "+1081").
  if (a.startsWith('+')) {
    // phone_b may already include the country code (form-fighting users).
    if (bDigits.length > 0 && bDigits.startsWith(aDigits)) return bDigits;
    return aDigits + bDigits;
  }

  // Israeli local form. Decide whether phone_b is the COMPLETE number on its
  // own (typed as "0544372393"), or the LOCAL part needing the area-code
  // prefix from phone_a (typed as "4372393").
  let combined;
  if (bDigits.length >= 9 && bDigits.startsWith('0')) {
    combined = bDigits;
  } else if (bDigits.length > 0) {
    combined = aDigits + bDigits;
  } else {
    combined = aDigits;
  }

  // Normalize: Israeli leading "0" → "972" so wa.me accepts it.
  if (combined.startsWith('0')) return '972' + combined.slice(1);
  return combined;
};

// E.164 form of the same resolution: a leading "+" on the digit string, or ''
// when there is no usable number. This is what the unified `guest.phone`
// column stores.
const toE164 = (phoneA, phoneB) => {
  const digits = buildWhatsAppDigits(phoneA, phoneB);
  return digits ? `+${digits}` : '';
};

module.exports = { buildWhatsAppDigits, toE164 };
