/**
 * parseDateLoose — accept either ISO `YYYY-MM-DD` or zero-padded
 * `DD/MM/YYYY` (the Israeli display format the in-app GuestWizard stores in
 * `families.start_date` / `end_date`). Returns a strict `YYYY-MM-DD` string
 * suitable for MySQL DATE columns, or `null` if the input doesn't match one
 * of those two shapes OR if the date is not a real calendar date.
 *
 * Strict on purpose: no single-digit day/month (`1/2/2026`), no two-digit
 * year, no `-` separators on the EU form, no time component. Anything that
 * doesn't match becomes `null` so the caller can return a clear validation
 * error instead of letting MySQL throw `Incorrect date value` later.
 *
 * The round-trip check (re-parse the result and verify components match)
 * rejects rollovers like `31/02/2026` that the regex itself would accept.
 */
const parseDateLoose = (value) => {
  if (typeof value !== 'string') return null;

  let y, m, d;
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const eu  = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (iso) {
    [, y, m, d] = iso;
  } else if (eu) {
    [, d, m, y] = eu;
  } else {
    return null;
  }

  // Calendar-validity check via round-trip. `new Date('2026-02-31T00:00:00Z')`
  // rolls over to March 3, so we re-extract the UTC components and require
  // them to match the input — otherwise it wasn't a real date.
  const dt = new Date(`${y}-${m}-${d}T00:00:00Z`);
  if (
    isNaN(dt.getTime()) ||
    dt.getUTCFullYear()   !== Number(y) ||
    dt.getUTCMonth() + 1  !== Number(m) ||
    dt.getUTCDate()       !== Number(d)
  ) {
    return null;
  }

  return `${y}-${m}-${d}`;
};

module.exports = { parseDateLoose };
