'use strict';

/**
 * flightTicketRequirement.js — single source of truth for "which flight-ticket
 * doc types does a guest need to upload", under the per-direction model.
 *
 * This is the shared helper every flight-ticket consumer (X/Y completeness,
 * public upload slots, coordinator panel, guest completeness, …) will move onto
 * in later steps. Step 1 only defines it; nothing wires it in yet.
 *
 * The model
 * ---------
 * A guest needs a (self-arranged) flight ticket for each LEG they do NOT fly
 * with us. The single "כולל טיסות" toggle (stored in the existing `guest.flights`
 * column) means "has flights WITH US", and `guest.flights_direction` says which
 * legs are with us:
 *
 *   כולל טיסות = FALSE (fully self-arranged)        → BOTH legs   → [outbound, return]
 *   כולל טיסות = TRUE:
 *       flights_direction = 'round_trip'            → both with us → []   (none)
 *       flights_direction = 'one_way_outbound'      → outbound with us, return self → [return]
 *       flights_direction = 'one_way_return'        → return with us, outbound self → [outbound]
 *       flights_direction missing / unrecognized    → []   (see "Missing direction")
 *
 * Missing direction
 * -----------------
 * When כולל טיסות is TRUE but the direction is empty/unset/unrecognized we return
 * NONE (defer), NOT both. Rationale: the final model makes direction a REQUIRED
 * field once כולל טיסות is on, so an unset direction is a "not yet decided" state
 * rather than "both legs self-arranged". Returning none avoids demanding tickets
 * from the many legacy/imported rows whose `flights_direction` was never
 * populated (the Excel import never writes it). The office sets the direction
 * and the requirement appears then.
 *
 * NOTE on data reliability (for later steps, not this one): `guest.flights` is
 * NULL for imported guests, so reading it as "כולל טיסות" will currently treat
 * imported (actually with-us) guests as fully self-arranged. That backfill is a
 * later step — this helper deliberately just encodes the rule and reads the real
 * fields. `flying_with_us` is intentionally NOT read here (it is being retired).
 */

// type_keys of the two per-direction flight-ticket doc types (must match the
// family_document_types seed in migrations/schema.js + the backfill script).
const FLIGHT_TICKET_OUTBOUND_KEY = 'flight_ticket_outbound';
const FLIGHT_TICKET_RETURN_KEY = 'flight_ticket_return';

// Accepts the assorted truthy encodings the `flights` column carries across the
// codebase (tinyint 1, "1", boolean true).
const isTruthyFlag = (v) => v === 1 || v === '1' || v === true || v === 'true';

/**
 * Which flight-ticket doc types this guest must upload.
 * @param {object} guest – needs `flights` (כולל טיסות) and `flights_direction`.
 * @returns {string[]} required type_keys, stable [outbound, return] order.
 *                     Empty array = no flight ticket required.
 */
const requiredFlightTicketTypeKeys = (guest = {}) => {
  // FALSE/missing כולל טיסות → fully self-arranged → both legs.
  if (!isTruthyFlag(guest.flights)) {
    return [FLIGHT_TICKET_OUTBOUND_KEY, FLIGHT_TICKET_RETURN_KEY];
  }
  // TRUE → the leg NOT flown with us is the one that needs a ticket.
  switch (String(guest.flights_direction || '').trim()) {
    case 'round_trip':       return [];
    case 'one_way_outbound': return [FLIGHT_TICKET_RETURN_KEY];   // return is self-arranged
    case 'one_way_return':   return [FLIGHT_TICKET_OUTBOUND_KEY]; // outbound is self-arranged
    default:                 return []; // missing/unrecognized → defer (see header)
  }
};

module.exports = {
  FLIGHT_TICKET_OUTBOUND_KEY,
  FLIGHT_TICKET_RETURN_KEY,
  requiredFlightTicketTypeKeys,
};
