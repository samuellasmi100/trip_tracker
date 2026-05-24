// Computes how complete a registered guest's info is for issuing a flight ticket.
//
// Returns { status, missing, total, filled }:
//   status  — "complete" (nothing missing) | "partial" (some filled, some not)
//             | "empty" (nothing filled at all)
//   missing — array of Hebrew labels for the fields still required
//
// Rules (confirmed with product):
//   Base — required for everyone:
//     identity_id, hebrew first+last name, english first+last name.
//   If flying_with_us == 1, ALSO required:
//     passport number + expiry, classification (סיווג), and — per flights_direction —
//     flight number + airline + date for each relevant direction:
//       one_way_outbound → outbound leg only
//       one_way_return   → return leg only
//       round_trip / empty / unrecognized → BOTH legs (empty also flags "כיוון טיסה").
//     Empty is the common case: the import never sets flights_direction, so an
//     unset direction must still surface missing flight legs, not skip them.
//   is_main_user is NOT special-cased: parents are judged by the same rules.
//
// Flight fields (passport_number, validity_passport, user_classification,
// outbound_*, return_*) come from the flights table, joined into the guest row by
// getFamilyGuests (server/sql/query/userQuery.js).

// Treats null/undefined/blank — and the app's empty-ish sentinels '""' / 'null' —
// as not filled.
const isFilled = (v) => {
  if (v === null || v === undefined) return false;
  const s = String(v).trim();
  return s !== "" && s !== '""' && s !== "null" && s !== "undefined";
};

export function getGuestCompleteness(guest = {}) {
  const flyingWithUs =
    Number(guest.flying_with_us) === 1 || guest.flying_with_us === true;

  // [label, value] pairs. A field is satisfied when its value isFilled().
  const required = [
    ["תעודת זהות", guest.identity_id],
    ["שם פרטי בעברית", guest.hebrew_first_name],
    ["שם משפחה בעברית", guest.hebrew_last_name],
    ["שם פרטי באנגלית", guest.english_first_name],
    ["שם משפחה באנגלית", guest.english_last_name],
  ];

  if (flyingWithUs) {
    required.push(
      ["מספר דרכון", guest.passport_number],
      ["תוקף דרכון", guest.validity_passport],
      ["סיווג", guest.user_classification],
    );

    const outbound = [
      ["מספר טיסת הלוך", guest.outbound_flight_number],
      ["חברת תעופה הלוך", guest.outbound_airline],
      ["תאריך טיסת הלוך", guest.outbound_flight_date],
    ];
    const ret = [
      ["מספר טיסת חזור", guest.return_flight_number],
      ["חברת תעופה חזור", guest.return_airline],
      ["תאריך טיסת חזור", guest.return_flight_date],
    ];

    const dir = String(guest.flights_direction || "").trim();

    // Most imported flying guests have NO direction set (the import never writes
    // flights_direction — only the in-app radio does). An empty direction must
    // therefore still surface missing flight legs, not skip them: flag the
    // direction itself AND fall back to requiring BOTH legs. Only an explicit
    // one-way value narrows the requirement to a single leg.
    if (!dir) required.push(["כיוון טיסה", ""]);

    const needOutbound = dir !== "one_way_return";
    const needReturn = dir !== "one_way_outbound";
    if (needOutbound) required.push(...outbound);
    if (needReturn) required.push(...ret);
  }

  const missing = required.filter(([, v]) => !isFilled(v)).map(([label]) => label);
  const total = required.length;
  const filled = total - missing.length;

  let status;
  if (missing.length === 0) status = "complete";
  else if (filled === 0) status = "empty";
  else status = "partial";

  return { status, missing, total, filled };
}

export default getGuestCompleteness;
