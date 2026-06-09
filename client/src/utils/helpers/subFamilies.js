// Sub-family grouping for the group-flights entry flow. A "group" is one family;
// sub-families are distinguished ONLY by surname (free text) — the Hebrew surname
// is the key, falling back to the English surname, else a "no surname" bucket
// (so English-only / foreign sub-families are still selectable). People who
// already have flight data are excluded (they're locked from a group apply).

export const LEG_KEYS = [
  "outbound_flight_date", "outbound_flight_number", "outbound_airline",
  "return_flight_date", "return_flight_number", "return_airline",
];
const isFilled = (v) => v !== null && v !== undefined && String(v).trim() !== "";

export const ALL_SCOPE = "__all__";
export const NONE_SURNAME = "__none__";

// "Already has flight data" → locked out of a group apply.
export const hasFlightData = (g = {}) => LEG_KEYS.some((k) => isFilled(g[k]));

export const surnameKey = (g = {}) => {
  const he = (g.hebrew_last_name || "").trim();
  if (he) return he;
  const en = (g.english_last_name || "").trim();
  if (en) return en;
  return NONE_SURNAME;
};

export const surnameLabel = (key) => (key === NONE_SURNAME ? "ללא שם משפחה" : key);

// Distinct surnames across ALL guests (largest first), each with how many are
// already filled (locked = have flight data). `done` = every member is filled,
// so the sub-family is complete; `selectable` = at least one member still needs
// flights (a partially-filled sub-family stays selectable so she can finish it).
// `count` = the still-selectable (non-locked) people. Mirrors the
// FamilyList/SendDocumentLinkDialog distinct-surname grouping.
export const computeSubFamilies = (guests = []) => {
  const agg = new Map(); // key -> { total, locked }
  guests.forEach((g) => {
    const key = surnameKey(g);
    const cur = agg.get(key) || { total: 0, locked: 0 };
    cur.total += 1;
    if (hasFlightData(g)) cur.locked += 1;
    agg.set(key, cur);
  });
  return [...agg.entries()]
    .map(([key, { total, locked }]) => ({
      key,
      label: surnameLabel(key),
      total,
      count: total - locked, // still selectable (non-locked) people
      done: total > 0 && locked === total,
    }))
    .sort((a, b) => b.total - a.total || a.label.localeCompare(b.label, "he"));
};
