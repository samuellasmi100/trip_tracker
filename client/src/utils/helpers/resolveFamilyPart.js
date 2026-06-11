import { toLocalYMD, displayToIso } from "./formatDate";

// Canonicalize any date-ish value (Date, ISO datetime, YYYY-MM-DD, or DD/MM/YYYY)
// to a plain ISO YYYY-MM-DD string so two dates compare reliably regardless of
// the shape they arrived in. Empty/invalid -> "".
const normDate = (v) => displayToIso(toLocalYMD(v));

/**
 * Resolve which vacation part (week / חריגים) a family belongs to.
 *
 * A family stores no week directly — only start_date/end_date — so its part is
 * implied by a date-range match against the vacation's parts. Single source of
 * truth for that match, shared by the edit dialog (to preselect the route) and
 * the family table's מסלול column.
 *
 * Returns the part NAME ("שבוע 2", "חריגים", …) or "" when unresolved:
 *  - no dates                         -> ""        (unassigned)
 *  - dates equal a dated part         -> that part's name
 *  - dates set but match no dated part-> "חריגים" if such a part exists, else ""
 *    (custom/exception dates — the חריגים part itself carries empty dates, so it
 *     never matches by equality; an exception family is identified by "has dates
 *     that fit no standard week").
 */
export const resolveFamilyPartName = (family, parts) => {
  if (!family) return "";
  const start = normDate(family.start_date);
  const end = normDate(family.end_date);
  if (!start || !end) return "";

  const list = Array.isArray(parts) ? parts : [];
  const exact = list.find(
    (p) => normDate(p.start_date) === start && normDate(p.end_date) === end
  );
  if (exact) return exact.name;

  const exception = list.find((p) => p.name === "חריגים");
  return exception ? exception.name : "";
};
