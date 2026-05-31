// Display helpers for the flight model: guest.flights ("כולל טיסות" = has flights
// WITH US) + guest.flights_direction (which legs are with us). Used by BOTH the
// Flights and GeneralInfo tables/exports so "כולל טיסות" and "טסים איתנו" are
// computed identically in every place (reconciles the old per-page divergences).
// flying_with_us is no longer read — flights + flights_direction is the source of truth.

const isTruthyFlag = (v) => v === 1 || v === "1" || v === true || v === "true";

// "כולל טיסות": does the guest have any flight with us?
export const includesFlights = (guest = {}) => isTruthyFlag(guest.flights);

// "טסים איתנו": which legs are flown WITH US, as a Hebrew label.
//   no flights with us → "לא"; round_trip → both legs; one-way → that leg;
//   with us but direction not yet set → "כן".
export const withUsLegsLabel = (guest = {}) => {
  if (!includesFlights(guest)) return "לא";
  switch (String(guest.flights_direction || "").trim()) {
    case "round_trip":       return "הלוך ושוב";
    case "one_way_outbound": return "הלוך בלבד";
    case "one_way_return":   return "חזור בלבד";
    default:                 return "כן";
  }
};
