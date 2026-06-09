const vacationDb = require("./vacationDb")
const { parseDateLoose } = require("../../utils/dateNormalize")
const logger = require("../../utils/logger")

const addVacation = async (vacationDetails,vacationId) => {
    const dateEntries = [];
    Object.keys(vacationDetails).forEach((key) => {
      if (key.startsWith("start_date")) {
        const index = key.split("_")[2]; 
        const start_date = vacationDetails[`start_date_${index}`];
        const end_date = vacationDetails[`end_date_${index}`];
    
        dateEntries.push({
          vacation_id:vacationId,
          start_date,
          end_date,
          name: `שבוע ${parseInt(index, 10) + 1}`,
        });
      }
    });
    if (vacationDetails.exceptions === "on") {
      dateEntries.push({
        vacation_id:vacationId,
        start_date: "",
        end_date: "",
        name: "חריגים",
      });
    }

     await vacationDb.addVacation(vacationDetails,vacationId)
     await Promise.all(dateEntries?.map((vac) => vacationDb.addVacationDates(vacationId,vac.start_date,vac.end_date,vac.name)));
}

const getVacations = async () => {
    return await vacationDb.getVacations()
}
const getVacationDates = async (vacationId) => {
  return await vacationDb.getVacationDates(vacationId)
}
const getAllVacationDates = async () => {
  return await vacationDb.getAllVacationDates()
}

// A part has no foreign key, and its linked guest/family rows live in a separate
// database (trip_tracker_<id>), so the DB can neither block nor cascade a delete.
// We answer "is this part still in use?" at the application level, mirroring the
// two ways the app links a part: the part NAME copied into guest.week_chosen, and
// the part date range copied into families.start_date/end_date. Returns the
// blocking families/guests BY NAME so the UI can tell the user who to reassign.
const getPartUsage = async (id) => {
  const partRows = await vacationDb.getVacationPartById(id)
  const part = partRows && partRows[0]
  if (!part) return null

  const guestRows = await vacationDb.getGuestsOnPart(part.vacation_id, part.name)
  const guests = (guestRows || [])
    .map((g) => `${g.hebrew_first_name || ""} ${g.hebrew_last_name || ""}`.trim())
    .filter((name) => name !== "")

  // Only match families by date when the part actually has a range. An empty-date
  // part (e.g. "חריגים") would otherwise match every family that also has blank
  // dates; such a part is linked only by name, which the guest check above covers.
  let families = []
  if (part.start_date && part.end_date) {
    const familyRows = await vacationDb.getFamiliesOnPartDates(part.vacation_id, part.start_date, part.end_date)
    families = (familyRows || []).map((f) => f.family_name)
  }

  return {
    part,
    families,
    guests,
    inUse: families.length > 0 || guests.length > 0,
  }
}

// Guarded delete: only an EMPTY part may be removed. If anything is still linked,
// block and return the blockers; the server enforces this regardless of the client.
const deleteVacationPart = async (id) => {
  const usage = await getPartUsage(id)
  if (!usage) {
    return { deleted: false, notFound: true }
  }
  if (usage.inUse) {
    return { deleted: false, blockers: { families: usage.families, guests: usage.guests } }
  }
  await vacationDb.deleteVacationPart(id)
  return { deleted: true }
}

// Update an EXISTING vacation in place, by its existing vacation_id — never
// generates a new id and never creates a tenant DB (that was the duplicate bug).
// Reconciliation rules are chosen to preserve the part-deletion guarantees:
//   - existing parts (have id) are UPDATED in place; their NAME is left untouched,
//     so a part families are already assigned to ("שבוע 3") never renumbers.
//   - genuinely new parts (no id) are INSERTed with a fresh "שבוע N" name, one
//     past the highest existing week number, so they never collide with — or
//     renumber — existing parts, even if a middle part was previously deleted.
//   - removal is intentionally NOT handled here. Parts are removed only through
//     the guarded delete endpoint, so an update can never silently drop an
//     in-use part.
//   - exceptions is additive: add a "חריגים" part only if requested and missing.
// Returns the fresh part rows (incl. ids for newly inserted parts) so the client
// can update its state without a manual refresh.
const updateVacation = async (payload, vacationId) => {
  await vacationDb.updateVacation(vacationId, payload.vacation_name)

  const existing = (await vacationDb.getVacationDates(vacationId)) || []
  const existingIds = new Set(existing.map((r) => r.id))

  let maxWeek = 0
  existing.forEach((r) => {
    const m = typeof r.name === "string" && r.name.match(/^שבוע\s+(\d+)$/)
    if (m) maxWeek = Math.max(maxWeek, parseInt(m[1], 10))
  })

  const parts = Array.isArray(payload.parts) ? payload.parts : []
  for (const p of parts) {
    const startDate = p.start_date || ""
    const endDate = p.end_date || ""
    if (p.id && existingIds.has(p.id)) {
      await vacationDb.updateVacationDate(p.id, startDate, endDate)
    } else {
      maxWeek += 1
      await vacationDb.addVacationDates(vacationId, startDate, endDate, `שבוע ${maxWeek}`)
    }
  }

  if (payload.exceptions && !existing.some((r) => r.name === "חריגים")) {
    await vacationDb.addVacationDates(vacationId, "", "", "חריגים")
  }

  const details = await vacationDb.getVacationDates(vacationId)

  // Re-derive guest week_chosen from the freshly-saved routes. Isolated in a
  // try/catch: the routes are already committed (the user's primary action), so
  // a re-sync failure must not turn a successful edit into a 500 — we report it
  // instead. The guest writes themselves are all-or-nothing (see vacationDb), so
  // a failure here never leaves a half-synced tenant.
  let resync = null
  try {
    resync = await resyncGuestWeeks(vacationId, details)
  } catch (error) {
    logger.error(`Error: Function:resyncGuestWeeks : ${error.sqlMessage || error.message}`)
    resync = { error: true, updatedCount: 0, unmatchedGuests: [], ambiguousGuests: [], unmatchedFamilies: [] }
  }

  return { details, resync }
}

// After a vacation edit, re-attach each guest to the route their stored dates
// actually fall in, so an in-place route-date change can't leave a guest pointing
// at the wrong week. Fail-safe by construction:
//   - match on BOTH dates (arrival == route.start AND departure == route.end); a
//     lone date is ambiguous because adjacent weeks share a boundary day.
//   - canonicalize both sides to ISO first — guest arrival/departure are stored
//     DD/MM/YYYY while route dates are ISO, so raw equality would never hit.
//   - exactly one match -> set week_chosen (skipped when already correct).
//   - zero or multiple matches -> leave the guest UNTOUCHED and report it; never
//     guess. We only ever write week_chosen to an existing route's existing name,
//     so routes are never renamed/renumbered (names are the assignment FK).
// Families are report-only: they carry no week_chosen, and rewriting their dates
// is blocked by the room-lock guard while assigned — so we just flag families
// whose range matches no current route for manual attention.
const resyncGuestWeeks = async (vacationId, routes) => {
  const report = { updatedCount: 0, unmatchedGuests: [], ambiguousGuests: [], unmatchedFamilies: [] }

  // Routes reduced to {name, start, end} with both dates canonicalized. Routes
  // without a real range (e.g. "חריגים") drop out and can match no one.
  const datedRoutes = (routes || [])
    .map((r) => ({ name: r.name, start: parseDateLoose(r.start_date), end: parseDateLoose(r.end_date) }))
    .filter((r) => r.start && r.end)

  const guests = (await vacationDb.getGuestsForResync(vacationId)) || []
  const updates = []
  for (const g of guests) {
    if (g.week_chosen === "חריגים") continue
    const gStart = parseDateLoose(g.arrival_date)
    const gEnd = parseDateLoose(g.departure_date)
    // Blank/unparseable dates -> the guest isn't date-assigned to a week, so
    // there is nothing to reconcile. Skip quietly (don't flood the report).
    if (!gStart || !gEnd) continue

    const matches = datedRoutes.filter((r) => r.start === gStart && r.end === gEnd)
    const guestName = `${g.hebrew_first_name || ""} ${g.hebrew_last_name || ""}`.trim()
    if (matches.length === 1) {
      if (matches[0].name !== g.week_chosen) {
        updates.push({ id: g.id, week_chosen: matches[0].name })
      }
    } else if (matches.length === 0) {
      report.unmatchedGuests.push({ name: guestName, week_chosen: g.week_chosen, arrival_date: g.arrival_date, departure_date: g.departure_date })
    } else {
      report.ambiguousGuests.push({ name: guestName, week_chosen: g.week_chosen, arrival_date: g.arrival_date, departure_date: g.departure_date, matchedWeeks: matches.map((m) => m.name) })
    }
  }

  await vacationDb.applyGuestWeekChosen(vacationId, updates)
  report.updatedCount = updates.length

  // Families: report-only. Flag any whose stored range matches no current route.
  const families = (await vacationDb.getFamiliesForResync(vacationId)) || []
  for (const f of families) {
    const fStart = parseDateLoose(f.start_date)
    const fEnd = parseDateLoose(f.end_date)
    if (!fStart || !fEnd) continue
    const hasMatch = datedRoutes.some((r) => r.start === fStart && r.end === fEnd)
    if (!hasMatch) {
      report.unmatchedFamilies.push({ family_name: f.family_name, start_date: f.start_date, end_date: f.end_date })
    }
  }

  return report
}

module.exports = {
    addVacation,
    getVacations,
    getVacationDates,
    getAllVacationDates,
    getPartUsage,
    deleteVacationPart,
    updateVacation
}