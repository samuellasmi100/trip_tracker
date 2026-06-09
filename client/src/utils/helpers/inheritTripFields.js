// Trip info inherited from the family head when bulk-adding people, so they
// aren't blank on the shared basics: the chosen week + stay dates ONLY.
//
// Flight participation is deliberately NOT inherited: "כולל טיסות" /
// flights_direction (and is_in_group) are per-person decisions — bulk-added
// people start with flights OFF and are set later, either individually in the
// guest editor or via the group-flights modal. Passport / names / personal docs
// are likewise per-person and never here.
export const TRIP_INHERIT_FIELDS = [
  "week_chosen",
  "arrival_date",
  "departure_date",
  "date_chosen",
];

// The one guest in a family flagged as head/main user (exactly one per family).
export const findMainUser = (guests = []) =>
  guests.find((g) => g.is_main_user === 1 || g.is_main_user === true) || null;

// Pull just the shared trip fields off the head, VERBATIM (raw stored values, so
// inheritors end up identical to the head — no re-formatting round-trips). Blank
// / null / undefined fields are omitted so we never overwrite with an empty.
export const inheritTripFields = (head) => {
  if (!head) return {};
  const out = {};
  TRIP_INHERIT_FIELDS.forEach((field) => {
    const value = head[field];
    if (value !== undefined && value !== null && value !== "") out[field] = value;
  });
  return out;
};
