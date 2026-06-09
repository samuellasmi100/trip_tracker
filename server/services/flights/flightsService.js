const flightsDb = require("./flightsDb")
const connection = require("../../db/connection-wrapper")

// The 6 shared leg fields the group-flights modal can apply. Passport,
// classification, seat, birth_date, age are deliberately NOT here — per-person,
// never written by the bulk path.
const OUTBOUND_LEGS = ["outbound_flight_date", "outbound_flight_number", "outbound_airline"];
const RETURN_LEGS = ["return_flight_date", "return_flight_number", "return_airline"];
const LEG_FIELDS = [...OUTBOUND_LEGS, ...RETURN_LEGS];

// Per-person, PERSONAL — never part of the shared apply. Each person's passport
// is merged into their OWN row only (Option B: blank keeps existing, never wipes).
const PASSPORT_FIELDS = ["passport_number", "validity_passport"];

const isFilled = (v) => v !== null && v !== undefined && String(v).trim() !== "";

// Overlay a person's own passport input over their existing values, preserving
// existing when an input is blank (never wipes). Shared legs never touch this.
const mergePassport = (person, existing) => {
  const out = {};
  PASSPORT_FIELDS.forEach((f) => {
    out[f] = isFilled(person[f])
      ? String(person[f]).trim()
      : (existing && existing[f] != null ? existing[f] : null);
  });
  return out;
};

// Which legs a person's direction is allowed to touch — mirrors the single-
// person editor (outbound-only shows only outbound inputs, etc.). An outbound-
// only person never gets a return leg written even if the shared return input
// was filled (and vice-versa); the other direction is left as-is.
const legKeysForDirection = (direction) => {
  if (direction === "one_way_outbound") return OUTBOUND_LEGS;
  if (direction === "one_way_return") return RETURN_LEGS;
  return LEG_FIELDS; // round_trip / empty → both
};

// Apply per-person flight intent + the shared legs, mirroring manual one-by-one
// editing (Option B). For each person:
//   flying=false → just clear the "כולל טיסות" flag (legs/direction untouched).
//   flying=true  → set flights=1 + their chosen direction, then write the legs
//     RELEVANT TO THAT DIRECTION: overlay only the non-blank shared legs, falling
//     back to the person's existing value (so a blank input never wipes, and the
//     non-applicable direction's legs are preserved). UPDATE existing row or
//     INSERT a new one. Passport/personal columns are never in the write.
// One transaction: all-or-nothing.
const applyFlightsBulk = async (familyId, people, legs, vacationId) => {
  const list = (people || []).filter((p) => p && p.user_id);
  if (list.length === 0) return { updated: 0 };

  // Only non-blank modal legs participate in any overlay.
  const overlay = {};
  LEG_FIELDS.forEach((f) => { if (isFilled(legs && legs[f])) overlay[f] = String(legs[f]).trim(); });

  // Existing rows for EVERYONE (not just flying) so the per-person passport merge
  // can preserve existing passport values when the input is left blank.
  const allIds = list.map((p) => String(p.user_id));

  return await connection.withTransaction(async (tx) => {
    const existingRows = allIds.length
      ? await flightsDb.getLatestFlightsByUserIdsTx(tx, allIds, vacationId)
      : [];
    const existingByUser = new Map((existingRows || []).map((r) => [String(r.user_id), r]));

    for (const person of list) {
      const userId = String(person.user_id);
      const existing = existingByUser.get(userId);

      // Each person's own passport — merged into their row only, never from the
      // shared legs. hasPassportInput gates writing it for non-flying people.
      const passport = mergePassport(person, existing);
      const hasPassportInput = PASSPORT_FIELDS.some((f) => isFilled(person[f]));

      if (!person.flying) {
        await flightsDb.setGuestNotFlyingTx(tx, userId, vacationId);
        // Passport is personal/independent of flying — persist it if entered.
        if (hasPassportInput) {
          if (existing) await flightsDb.updateFlightLegsTx(tx, passport, userId, vacationId);
          else await flightsDb.insertFlightRowTx(tx, { user_id: userId, family_id: familyId, ...passport }, vacationId);
        }
        continue;
      }

      const direction = person.direction || "round_trip";
      const applicable = legKeysForDirection(direction);

      // Merge all 6 leg columns: overlay the shared value only when this field is
      // applicable for the person's direction AND was filled; else keep existing.
      const merged = {};
      LEG_FIELDS.forEach((f) => {
        const useOverlay = applicable.includes(f) && overlay[f] !== undefined;
        merged[f] = useOverlay ? overlay[f] : (existing && existing[f] != null ? existing[f] : null);
      });
      // Passport rides along in the same write but comes from the person's OWN
      // input/existing — the shared apply never reaches it.
      const row = { ...merged, ...passport };

      if (existing) {
        await flightsDb.updateFlightLegsTx(tx, row, userId, vacationId);
      } else {
        await flightsDb.insertFlightRowTx(tx, { user_id: userId, family_id: familyId, ...row }, vacationId);
      }
      await flightsDb.setGuestFlyingFlagTx(tx, userId, direction, vacationId);
    }
    return { updated: list.length };
  });
};

const addFlightsDetails = async (paymentsData,vacationId) => {
    return await flightsDb.addFlightsDetails(paymentsData,vacationId)
}
const updateFlightsDetails = async (paymentsData,vacationId) => {
    return await flightsDb.updateFlightsDetails(paymentsData,vacationId)
}
const getFlightsDetails = async (userId,familyId,isInGroup,vacationId) => {

    const result = await flightsDb.getFlightsDetails(userId,vacationId)
    if(result.length === 0 || result[0].all_flight_data_null === 1){
        if(Number(isInGroup) === 1){
            const isSourceUserExist = await getFlightsByFamily(familyId,vacationId)
            if(isSourceUserExist.length > 0){
                let dataToUpdate = {
                    "outbound_flight_date":isSourceUserExist[0].outbound_flight_date,
                    "return_flight_date": isSourceUserExist[0].return_flight_date,
                    "outbound_flight_number":isSourceUserExist[0].outbound_flight_number,
                    "return_flight_number": isSourceUserExist[0].return_flight_number,
                    "outbound_airline": isSourceUserExist[0].outbound_airline,
                    "return_airline": isSourceUserExist[0].return_airline,
                    "user_id":userId
                } 
                await flightsDb.addFlightsDetails(dataToUpdate,vacationId)
            }
        }
    }else {
        const isSourceUserExist = await getFlightsByFamily(familyId,vacationId)
        if(Number(isInGroup) === 1){
            if(isSourceUserExist.length > 0){
                let dataToUpdate = {
                    "outbound_flight_date":isSourceUserExist[0].outbound_flight_date,
                    "return_flight_date": isSourceUserExist[0].return_flight_date,
                    "outbound_flight_number":isSourceUserExist[0].outbound_flight_number,
                    "return_flight_number": isSourceUserExist[0].return_flight_number,
                    "outbound_airline": isSourceUserExist[0].outbound_airline,
                    "return_airline": isSourceUserExist[0].return_airline,
                    "user_id":userId
                } 
                await flightsDb.updateFlightsDetails(dataToUpdate,vacationId)
            }
        }
    }
    return await flightsDb.getFlightsDetails(userId,vacationId)
}
const getFlightsByFamily = async (id,vacationId) => {
    return await flightsDb.getFlightsByFamily(id,vacationId)
}

const getFamilyFlightsWithNames = async (familyId, vacationId) => {
    return await flightsDb.getFamilyFlightsWithNames(familyId, vacationId);
}

module.exports = {
    addFlightsDetails,
    updateFlightsDetails,
    getFlightsDetails,
    getFlightsByFamily,
    getFamilyFlightsWithNames,
    applyFlightsBulk,
}