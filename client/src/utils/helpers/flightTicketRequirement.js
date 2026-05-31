// Client mirror of server/services/documents/flightTicketRequirement.js.
// Kept in LOCKSTEP with the server helper — if the rule changes, change BOTH
// (client and server are separate bundles; same convention as phoneFormat.js).
//
// A guest needs a self-arranged flight ticket for each LEG they do NOT fly with
// us. "כולל טיסות" (guest.flights) = has flights WITH US; guest.flights_direction
// says which legs are with us:
//   flights FALSE (fully self-arranged)        → [outbound, return]
//   flights TRUE  + round_trip                 → []          (both with us)
//                 + one_way_outbound           → [return]    (return self-arranged)
//                 + one_way_return             → [outbound]  (outbound self-arranged)
//                 + missing/unrecognized       → []          (defer until direction set)

export const FLIGHT_TICKET_OUTBOUND_KEY = "flight_ticket_outbound";
export const FLIGHT_TICKET_RETURN_KEY = "flight_ticket_return";

const isTruthyFlag = (v) => v === 1 || v === "1" || v === true || v === "true";

// Returns the required flight-ticket type_keys, stable [outbound, return] order.
export function requiredFlightTicketTypeKeys(guest = {}) {
  if (!isTruthyFlag(guest.flights)) {
    return [FLIGHT_TICKET_OUTBOUND_KEY, FLIGHT_TICKET_RETURN_KEY];
  }
  switch (String(guest.flights_direction || "").trim()) {
    case "round_trip":       return [];
    case "one_way_outbound": return [FLIGHT_TICKET_RETURN_KEY];
    case "one_way_return":   return [FLIGHT_TICKET_OUTBOUND_KEY];
    default:                 return [];
  }
}
